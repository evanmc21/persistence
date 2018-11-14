const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const passport = require('passport');
const validatePost = require('../../validations/post');

router.get('/test', (req, res) => res.json({ msg: 'Post Works' }));

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404));
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404));
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      content: req.body.content,
      name: req.user.name,
      avatar: req.user.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findOneAndRemove({ _id: req.params.id, user: req.user.id })
      .then(post => {
        return !post
          ? res.status(401).json({ post: 'post not found' })
          : res.status(200).json({ post: 'post deleted' });
      })
      .catch(err =>
        res.status(404).json({ post: 'there is a problem deleting the post' })
      );
  }
);
module.exports = router;
