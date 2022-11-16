const {Router} = require('express');
const {MY_API_KEY} = process.env
const {Diet} = require('../db') 

const diets = Router();

diets.get('/', function(req,res){
    Diet.count()
    .then(count =>{
        if(count < 11){
            Diet.bulkCreate([
                {name:'Gluten Free'},
                {name:'Ketogenic'},
                {name:'Vegetarian'},
                {name:'Lacto-Vegetarian'},
                {name:'Ovo-Vegetarian'},
                {name:'Vegan'},
                {name:'Pescetarian'},
                {name:'Paleo'},
                {name:'Primal'},
                {name:'Low FODMAP'},
                {name:'Whole30'}
            ])
            .then(diets=>res.send({dietArray:diets}));
        }else{
            Diet.findAll()
            .then(diets=>res.send({dietArray:diets}));
        }
    })
})