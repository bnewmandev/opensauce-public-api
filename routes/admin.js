const router = require('express').Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation, passwordValidation } = require("../validation");
const dotenv = require("dotenv");
const auth = require('./verifyToken');
const Search = require('../model/Search');
const Ingredient = require('../model/Ingredient');



router.post("/ping", (req,res) => { 
    res.send("Pong!") 
});

router.post("/newingredient", auth, async (req,res) => {
    if(req.user.accesslevel < 10) res.status(401).send("Access level must be greater than 10 for access")

    const ingredient = new Ingredient({
        name: req.body.name,
        image: req.body.image
    });
});


module.exports = router;