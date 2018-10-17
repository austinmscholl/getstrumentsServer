var express = require('express')
var router = express.Router()   
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var Item = sequelize.import('../models/item');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 

const validateSession = require('../middleware/validate-session');


router.post('/signup', function (req, res) {

    var email = req.body.user.email;
    var pass = req.body.user.password;
  
    User.create({
      email: email,
      passwordhash: bcrypt.hashSync(pass, 10)
    }).then(
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

router.post('/login', function(req, res) {
    User.findOne( { where: { email: req.body.user.email } } ).then(
        function(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.passwordhash, function(err, matches){
                    if (matches) {
                        var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24 });
                        res.json({ 
                            user: user,
                            message: "successfully authenticated",
                            sessionToken: token
                        });
                    }else {
                        res.status(502).send({ error: "you failed, yo" });
                    }
                });
            } else {
                res.status(500).send({ error: "failed to authenticate" });
            }
        },
        function(err) {
            res.status(501).send({ error: "you failed, yo" });
        }
    );
});


module.exports = router;