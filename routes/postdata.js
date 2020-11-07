const router = require('express').Router();
const User = require("../model/User");
const Post = require("../model/Post");
const auth = require('./verifyToken');
const { postValidation } = require("../validation");

router.post('/ping', (req,res) => {
    res.send("Pong!")
});

router.post('/new', auth, async (req,res) => {

    let d = new Date();
    let epoch = d.getTime();

    //Validation
    const {error} = postValidation(req.body);
    if(error) return res.status(400).send(error)

    const post = new Post({
        title: req.body.title,
        user: req.user.username,
        date: epoch,
        body: req.body.body,
        comments: []
    });
    console.log(post)
    try {
        const newPost = await post.save();
        res.send(post)
    } catch (err) {
        console.log("oof");
        res.status(400).send(err);
    }
});

module.exports = router;