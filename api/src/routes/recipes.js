const {Router} = require('express');
const { Op } = require('sequelize');
const {Recipe, Diet} = require('../db');
const recipes = Router();

recipes.get('/', function(req,res){
    if(!req.query.name){
        res.status(422).send('"name" query parameter is missing or undefined');
    }else{
        Recipe.findAll({where:{
            name:{[Op.substring]:req.query.name}
        }})
        .then(found => res.send(found))
    };
});

recipes.get('/:id', function(req,res){
    Recipe.findByPK(req.params.id)
    .then(found => res.send(found))
});

recipes.post('/', function(req,res){
    let recipeQ = Recipe.create(req.body.recipe);
    let dietQ = Diet.findAll({where:{
        name:{[Op.in]:dietNameArray}
    }});
    Promise.all([recipeQ, dietQ])
    .then(([recipe, dietArray]) => recipe.setDiets(dietArray));
})