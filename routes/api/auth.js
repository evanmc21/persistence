const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// validations
const validateSignUp = require('../../validations/signup');
const validateLogin = require('../../validations/login');

const Auth = require('../../models/Auth');

router.get('/test', (req, res) => res.json({ msg: 'Auth Works' }));

router.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignUp(req.body);

  // check for validations
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Auth.findOne({ email: req.body.email }).then(auth => {
    if (auth) {
      errors.email = 'email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url('req.body.email', {
        s: '200',
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
          if (err) throw err;
          newAuth.password = hash;
          newAuth
            .save()
            .then(auth => res.json(auth))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }

  const password = req.body.password;
  const email = req.body.email;

  Auth.findOne({ email }).then(auth => {
    if (!auth) {
      errors.email = 'user not found';
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, auth.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: auth.id,
          email: auth.email,
          name: auth.name
        };
        // sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 7200 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer' + token
            });
          }
        );
      } else {
        errors.password = 'incorrect password';
        return res.status(404).json(errors);
      }
    });
  });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
