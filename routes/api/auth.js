const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys');
const passport = require('passport');

const Auth = require('../../models/Auth');

router.get('/test', (req, res) => res.json({ msg: 'Auth Works' }));

router.post('/signup', (req, res) => {
  Auth.findOne({ email: req.body.email }).then(
    auth => {
       if(auth) {res.status(400).json({ email: 'email already exists'})
    } else {
      const avatar = gravatar.url('req.body.email', {
        s:'200',
        r: 'pg',
        d: 'mm'
      });

      const newAuth = new Auth({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAuth.password, salt, (err, hash) => {
          if(err) throw err;
          newAuth.password = hash;
          newAuth.save().then(auth => res.json(auth))
          .catch(err => console.log(err));
        }); 
      });
    }
  });
});

router.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  debugger
  Auth.findOne({email}).then(auth =>
     
    {
    if (!auth) {
      return res.status(404).json({email: 'User not found'})
    }

    bcrypt.compare(password, auth.password)
    .then(isMatch => {
      if(isMatch){

        const payload = {
          id: auth.id, 
          email: auth.email,
          name: auth.name
        }
        // sign token
        jwt.sign(payload, keys.secretOrKey, 
        { expiresIn: 7200 },
        (err, token) => {
           res.json({
             success: true,
             token: 'Bearer' + token
           });
        });
      } else {
        return res.status(404).json({password: 'incorrect password'});
      }
    });
  });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;