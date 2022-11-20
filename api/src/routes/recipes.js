const {Router} = require('express');
const { Op } = require('sequelize');
const {Recipe, Diet} = require('../db');
const recipes = Router();
const fetcher= require('./fetcher');
const {MY_API_KEY} = process.env;


recipes.get('/', function(req,res){
    if(!req.query.name){ //request fails if name is not defined
        res.status(422).send('"name" query parameter is missing or undefined');
    }else{
        let dbQ = Recipe.findAll({where:{ //looks for db elems that have queried name in any position
            name:{[Op.iLike]:'%'+req.query.name+'%'} 
        }})
        .then((found)=> Promise.all(found.map(element=>
            //takes all found elements, queries for their associated diets.
            element.getDiets() //since this id is used for the /:id GET, it'll be preceded by 'd'
            .then(diets => ({img:null, name:found.name, id:'d'+found.id, diets:diets }))
            //makes a promise that resolves to an array of results
            ))
            
        )

        //makes initial api query for matching recipees.
        let apiQ = fetcher(`https://api.spoonacular.com/recipes/complexSearch?query=${req.query.name}&apiKey=${MY_API_KEY}`)
        .then(res=> res.json())
        .then(data => {
            let idString = data.shift().id;
            data.results.forEach(element => {
                idString = idString+ ',' + element.id
            }); //ids are accumulated in along string, separated by commas, then fetched in a single request
            return fetcher(`https://api.spoonacular.com/recipes/${idString}/information`)
            .then(recipeList => recipeList.map(element=>({id:element.id, name:element.title, img:element.image, diets:element.diets})))    
        }
        )
        //once both queries are finished, data is sent back
        Promise.all([dbQ, apiQ])
        .then(([dbData, apiData])=> res.send({dbData:dbData, apiData:apiData}))
    };
});

recipes.get('/:id', function(req,res){
    if(req.params.id[0] === 'd'){ //if the id is preceded by a 'd', its taken as a database id
        Recipe.findByPK( Number(req.params.id.slice(1))) //removes the 'd' and turns string into number
        .then(recipe=>{
            recipe.getDiets() //since display id must show it is a database id, appends 'd' to outgoing value
            .then(diets => ({...recipe, id:'d'+recipe.id, diets: diets}) )
            .then(payload=> res.send(payload));
        });
    }else{ //all other requests are taken as api queries
        fetcher(`https://api.spoonacular.com/recipes/${req.params.id}/information`)
        .then(data=> ({id:data.id, name:data.title, img:data.image, diets:data.diets}))
        .then(payload=> res.send(payload));
    }
});

recipes.post('/', function(req,res){
    let recipeQ = Recipe.create(req.body.recipe);
    let dietQ = Diet.findAll({where:{
        name:{[Op.in]:dietNameArray}
    }});
    Promise.all([recipeQ, dietQ])
    .then(([recipe, dietArray]) => recipe.setDiets(dietArray))
    .then(()=>res.status(201).send());
});

module.exports = {recipes}