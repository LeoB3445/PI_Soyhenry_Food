const {Router} = require('express');
const { Op } = require('sequelize');
const {Recipe} = require('../db');
const recipes = Router();

recipes.get('/', function(req,res){
    if(!req.query.name){
        res.status(422).send('"name" query parameter is missing or undefined');
    }else{
        Recipe.findAll({where:{
            name:{[Op.substring]:req.query.name}
        }})
        .then(found => res.send(found))
    }
});