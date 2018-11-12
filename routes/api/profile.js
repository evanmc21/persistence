const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfile = require('../../validations/profile');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    // use profile model to find user
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.none = "a profile doesn't exist for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// fetch profile by handle

router.get('/handle/:handle', (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.none = "It doesn't looke like there's a profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// fetch profile by userid

router.get('/user/:user_id', (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.none = "It doesn't looke like there's a profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// create and update profile
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfile(req.body);
    // check validations

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.social = {};

    const whiteList = [
      'handle',
      'website',
      'bio',
      'experienceLevel',
      'location',
      'skills',
      'youtube',
      'twitter',
      'instagram',
      'facebook',
      'linkedin',
      'favoriteQuote',
      'specialty'
    ];
    const inputData = Object.keys(req.body);

    for (key of inputData) {
      if (whiteList.includes(key)) {
        if (key === 'skills' && typeof req.body.skills !== 'undefined') {
          profileFields[key] = req.body.skills.split(',');
        } else if (
          ['youtube', 'twitter', 'instagram', 'linkedin'].includes(key) &&
          req.body[key]
        ) {
          profileFields.social[key] = req.body[key];
        } else if (req.body[key]) {
          profileFields[key] = req.body[key];
        }
      }
    }

    Profile.findOne({ handle: profileFields.handle }).then(profile => {
      if (profile && profile.user != req.user.id) {
        errors.handle = 'this handle already exists';
        res.status(400).json(errors);
      } else {
        Profile.findOne({ user: req.user.id }).then(profile => {
          if (profile) {
            Profile.findOneAndUpdate(
              {
                user: req.user.id
              },
              {
                $set: profileFields
              },
              { new: true }
            ).then(profile => res.json(profile));
          } else {
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          }
        });
      }
    });
  }
);

module.exports = router;
