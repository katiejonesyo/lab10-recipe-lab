const { Router } = require('express');
const Recipe = require('../models/recipe.js')

module.exports = Router()
    .post('/', (req,res,next) => {
        Recipe
        .insert(req.body)
        .then((recipe) => res.send(recipe))
        .catch(next)
    })
    .get('/', (req,res,next) => {
        Recipe
        .find(req.body)
        .then((recipes) => res.send(recipes))
        .catch(next)
    })
    .get('/:id', (req, res, next) => {
        Recipe
        .findById(req.params.id)
        .then((recipe) => res.send(recipe))
        .catch(next)
    })
    .put('/:id', (req,res,next) => {
        Recipe
        .update(req.params.id, req.body)
        .then((recipes) => res.send(recipes))
        .catch(next)
    })
    .delete('/:id', (req,res,next) => {
        Recipe
        .delete(req.params.id)
        .then((recipes) => res.send(recipes))
        .catch(next)
    });

    
