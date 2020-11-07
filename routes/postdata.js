const router = require('express').Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const auth = require('./verifyToken');
const { postValidation, deleteUserValidation } = require("../validation");
const Search = require('../model/Search');

router.post('/ping', (req,res) => {
    res.send("Pong!")
});

router.post('/new', auth, async (req,res) => {

    if(req.user.accesslevel < 4) res.status(401).send("Please contact an admin to reques post creation permission")

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

    const searchRecord = new Search({
        type: "Post",
        referenceid: post._id,
        name: post.title,
        link: `/posts/${post._id}`
    });

    try {
        
        const u1 = await User.findOne({username: req.user.username})
        
        let postList = u1.posts;
        console.log(postList);
        postList.push(post);
        console.log("try");
        let doc = await User.findOneAndUpdate({username: req.user.username}, {posts: postList});
        const newPost = await post.save();
        const newRecord = await searchRecord.save();
        res.send(post);
    } catch (err) {
        console.log("oof");
        res.status(400).send(err);
    }
});


router.post('/deletepost', auth, async (req,res) => {

    const {error} = deleteUserValidation(req.body);
    if(error) return res.status(401).send(error)

    let user = await User.findById(req.user._id);
    const post = await Post.findById(req.body.deletepost);
    if (post.user == req.header.username)
    {
        //TODO: Delete post logic
        res.send("Post has been deleted");
    }
    else res.status(401).send("Invalid Access Token")
});


module.exports = router;