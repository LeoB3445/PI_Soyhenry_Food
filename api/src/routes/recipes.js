const {Router} = require('express');
const { Op } = require('sequelize');
const {Recipe, Diet} = require('../db');
const recipes = Router();
var fetch = require('node-fetch');
const {MY_API_KEY} = process.env;


recipes.get('/', function(req,res){
    if(!req.query.name){
        res.status(422).send('"name" query parameter is missing or undefined');
    }else{
        let dbQ = Recipe.findAll({where:{
            name:{[Op.substring]:req.query.name}
        }})
        .then((found)=> Promise.all(found.map(element=>
            
            element.getDiets()
            .then(diets => ({img:null, name:found.name, id:'d'+found.id, diets:diets }))
            
            ))
            
        )


        let apiQ = fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${req.query.name}&apiKey=${MY_API_KEY}`)
        .then(res=> res.json())
        .then(data => {
            let idString = data[0].id;
            data.results.forEach(element => {
                idString = idString+ ',' + element.id
            }); 
            return fetch(`https://api.spoonacular.com/recipes/${idString}/information`)
            .then(res => res.json)
            .then(recipeList => recipeList.map(element=>({id:element.id, name:element.title, img:element.image, diets:element.diets})))    
        }
        )
        
        Promise.all([dbQ, apiQ])
        .then(([dbData, apiData])=> res.send({dbData:dbData, apiData:apiData}))
    };
});

recipes.get('/:id', function(req,res){
    if(req.params.id[0] === 'd'){
        Recipe.findByPK(req.params.id)
        .then(recipe=>{
            recipe.getDiets()
            .then(diets => ({...recipe, id:'d'+recipe.id, diets: diets}) )
            .then(payload=> res.send(payload));
        });
    }else{
        let apiQ = fetch(`https://api.spoonacular.com/recipes/${req.params.id}/information`)
        .then(data => data.json())
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