const router = require('express').Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const auth = require('./verifyToken');
const { postValidation, commentValidation } = require("../validation");

router.post("/ping", (req,res) => {
    res.send("Pong!");
});

router.post("/new", auth, async (req,res) => {

    let d = new Date();
    let epoch = d.getTime();

    //Validation
    const {error} = commentValidation(req.body);
    if(error) return res.status(400).send(error);

    const comment = new Comment({
        title: req.body.title,
        user: req.user.username,
        date: epoch,
        body: req.body.body,
        postid: req.body.postid
    });
    console.log(comment);
    try {
        const post = await Post.findById(comment.postid);
        console.log(post);
        let postComments = post.comments;
        postComments.push(comment);
        let doc = await Post.findByIdAndUpdate(comment.postid, {comments: postComments});
        const newDoc = await comment.save();
        res.send(comment);
    }
    catch (err){
        console.log("oof");
        res.status(400).send(err);
    }
});

module.exports = router;