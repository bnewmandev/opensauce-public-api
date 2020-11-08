const router = require('express').Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const auth = require('./verifyToken');
const { postValidation, deleteUserValidation } = require("../validation");
const Search = require('../model/Search');

router.get('/ping', (req,res) => {
    res.send({message: "OK!"})
});

router.post('/new', auth, async (req,res) => {

    if(req.user.accesslevel < 4) return res.status(401).send({error: "Please contact an admin to request the needed permissions to complete this operation", permission: "CREATE_POST"})

    let d = new Date();
    let epoch = d.getTime();

    //Validation
    const { error } = postValidation(req.body);
    if(error) return res.status(400).send({error: error.details[0].message})

    const post = new Post({
        title: req.body.title,
        user: req.user.username,
        date: epoch,
        body: req.body.body,
        comments: []
    });
    const searchRecord = new Search({
        type: "Post",
        referenceid: post._id,
        name: post.title,
        link: `/posts/${post._id}`
    });

    try {
        
        const u1 = await User.findOne({username: req.user.username})
        
        let postList = u1.posts;
        postList.push(post);
        let doc = await User.findOneAndUpdate({username: req.user.username}, {posts: postList});
        const newPost = await post.save();
        const newRecord = await searchRecord.save();
        res.status(201).send({payload: post});
    } catch (err) {
        console.log(err)
        res.status(400).send({error: err.message});
    }
});


router.post('/delete', auth, async (req,res) => {

    const { error } = deleteUserValidation(req.body);
    if (error) return res.status(401).send(error.details[0].message)

    let user = await User.findById(req.user._id);
    const post = await Post.findById(req.body.postid);
    if (!post) return res.status(404).send({error: 'Could not find post to delete!'})
    if (post.user == req.user.username)
    {
        //TODO: Delete post logic
        res.status(200).send({message: "Post has been deleted"});
    }
    else res.status(401).send({error: "Access Token provided is invalid"})
});


module.exports = router;