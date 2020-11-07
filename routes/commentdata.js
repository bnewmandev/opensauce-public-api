const router = require('express').Router();
const User = require("../model/User");
const Post = require("../model/Post");
const auth = require('./verifyToken');
const { postValidation } = require("../validation");

router.post("/ping", (req,res) => {
    res.send("Pong!");
});

router.post("/new", auth, async (req,res) => {

    let d = new Date();
    let epoch = d.getTime();

    
})

module.exports = router;