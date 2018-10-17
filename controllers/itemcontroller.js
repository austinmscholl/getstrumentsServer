var express = require('express')
var router = express.Router()    
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var Item = sequelize.import('../models/item');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 
// Item.sync({force:'true'})

const validateSession = require('../middleware/validate-session');

//used to create an item
router.post('/', validateSession, function(req, res) {
    const itemFromRequest = {
        type: req.body.item.type,
        brand: req.body.item.brand,
        model: req.body.item.model,
        notes: req.body.item.notes,
        location: req.body.item.location,
        owner: req.user.id,
        availability: req.body.item.availability,
        rating: req.body.item.rating
        // dailyCost: req.body.item.dailyCost
    }
    
    Item.create(itemFromRequest).then(
      function createSuccess(user) {
        var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
        res.json({
          user: user,
          message: 'created',
          sessionToken: token
        });
      },
      function createError(err) {
        res.send(500, err.message);
      }
    );
});

//used to getall items, may not be needed
// router.get('/', validateSession, function(req, res) {
//     Item.findAll()
//         .then(item => res.status(200).json(item))
//         .catch(err => res.status(500).json({ error: err }))
// });

router.get('/', validateSession, function(req, res) {
    Item.findAll({ where: { owner: req.user.id }})
        .then(item => res.status(200).json(item))
        .catch(err => res.status(500).json({ error: err }))
})

//used to get items by type
router.get('/rent/:type', validateSession, function(req, res) {
    Item.findAll({ where: { type: req.params.type }})
        .then(item => res.status(200).json(item))
        .catch(err => res.status(500).json({ error: err }))
});

//
router.get('/:id', validateSession, function(req, res) {
    Item.findOne({ where: { id: req.params.id }})
        .then(item => res.status(200).json(item))
        .catch(err => res.status(500).json({ error: err }))
})

//used to update item and/or change AVAILABILITY
router.put('/:id', validateSession, function(req, res) {
    if (!req.errors) {
        Item.update(req.body.item, { where: { id: req.params.id }})         //req.body -> req.item.body OR req.body.item
            .then(item => res.status(200).json(item))
            .catch(err => res.status(500).json({ error: err}))
    } else {
        res.status(500).json(req.errors)
    }
});

router.delete('/:id', validateSession, function(req, res) {
    if (!req.errors) {
        Item.destroy({ where: { id: req.params.id }})
            .then(item => res.status(200).json(item))
            .catch(err => res.status(500).json({ error: err }))
    } else {
        res.status(500).json(req.errors)
    }
});
  
module.exports = router;