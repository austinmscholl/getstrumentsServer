var express = require('express')
var router = express.Router()    
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var Booking = sequelize.import('../models/booking');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 

const validateSession = require('../middleware/validate-session');


router.post('/', validateSession, function(req, res) {
    const bookingRequest = {
        from: req.body.booking.from,
        to: req.body.booking.to,
        itemId: req.body.booking.itemId,
        renterId: req.user.id
    }
    
    Booking.create(bookingRequest).then(
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

router.get('/', validateSession, function(req, res) {
    Booking.findAll()
        .then(booking => res.status(200).json(booking))
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/:renterId', validateSession, function(req, res) {
    Booking.findAll({ where: { renterId: req.params.renterId }})
        .then(booking => res.status(200).json(booking))
        .catch(err => res.status(500).json({ error: err }))
});

router.put('/:id', validateSession, function(req, res) {
    if (!req.errors) {
        Booking.update(req.body, { where: { id: req.params.id }})
            .then(booking => res.status(200).json(booking))
            .catch(err => res.status(500).json({ error: err}))
    } else {
        res.status(500).json(req.errors)
    }
});

router.delete('/:id', validateSession, function(req, res) {
    if (!req.errors) {
        Booking.destroy({ where: { id: req.params.id }})
            .then(booking => res.status(200).json(booking))
            .catch(err => res.status(500).json({ error: err }))
    } else {
        res.status(500).json(req.errors)
    }
});
  
module.exports = router;