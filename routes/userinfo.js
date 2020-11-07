const router = require('express').Router();
const auth = require('./verifyToken');
const User = require("../model/User");
const Post = require("../model/Post");
const { userChangeValidation } = require("../validation");


router.get('/ping', (req,res) => {
    res.json(
        {
            title: "Pong!",
        });
});

router.get('/userinfo', auth, (req, res) => {
    res.json(
        {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            date: req.user.date,
            favorites: req.user.favorites,
            profilepicture: req.user.profilepicture,
            biography: req.user.biography,
            posts: req.user.posts
    });
});

router.post('/edituser', auth, async (req,res) => {

    const {error} = userChangeValidation(req.body);
    if(error) return res.status(400).send(error)

    if(req.body.biography) let bioData = await User.findByIdAndUpdate(req.user._id, {biography: req.body.biography});
    if(req.body.favorites) let favData = await User.findByIdAndRemove(req.user._id, {favorites: req.body.favorites});

});

module.exports = router; 
