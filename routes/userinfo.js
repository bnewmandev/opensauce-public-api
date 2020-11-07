const router = require('express').Router();
const auth = require('./verifyToken');
const User = require("../model/User");
const { userChangeValidation } = require("../validation");
const { compareSync } = require('bcryptjs');


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
    let bioData = null;
    let favData = null;
    if(req.body.biography) 
    {
        console.log(req.user._id)
        bioData = await User.findByIdAndUpdate(req.user._id, {biography: req.body.biography});
    }
    if(req.body.favorites)
    {
        favData = await User.findByIdAndUpdate(req.user._id, {favorites: req.body.favorites});
    }

    res.send({
        "biography": req.body.biography,
        "favorites": req.body.favorites
    })

});

module.exports = router; 
