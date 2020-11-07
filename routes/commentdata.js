const router = require('express').Router();
const User = require("../model/User");
const Post = require("../model/Post");
const auth = require('./verifyToken');
const { postValidation } = require("../validation");

router.post("/ping", (req,res) => {
    res.send("Pong!");
})

module.exports = router;