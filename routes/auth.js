const router = require('express').Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation, passwordValidation } = require("../validation");
const dotenv = require("dotenv");
const auth = require('./verifyToken');





dotenv.config();


//when navigating to /ping perform callback function
router.post("/ping", (req,res) => { 
    //Data that is sent as a json response to post
    res.send("Pong!") 
});

//Create user
router.post("/register", async (req,res) => {

    //Validation
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error)

    //Checking if username is already in the database
    const usernameExist = await User.findOne({username: req.body.username})
    if (usernameExist) 
    {
        res.status(400).send({
        userExist: true
    })}

    //Checking if email is already in the database
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) 
    {
        res.status(400).send({
        emailExist: true
    })}

    //Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hpass = await bcrypt.hash(req.body.password, salt);

    let d = new Date();
    let epoch = d.getTime();

    const user = new User({
        //Data that is recieved from the body of the post
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: hpass,
        date: epoch
    })
    try {
        const newUser = await user.save();
        res.send({user: user._id});
    }
    catch(err) {
        res.status(400).send(err);
    }

});

//Log in
router.post('/login', async (req, res) => {

    //Validation
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error)

    //Checking if username is already in the database
    const user = await User.findOne({username: req.body.username})
    console.log(user);
    if (!user) res.status(400).send({userExist: false});

    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) res.status(400).send({validPassword: false});

    //Create & assign a token
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        date: user.date,
        favorites: user.favorites,
        profilepicture: user.profilepicture,
        biography: user.bio
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token);

    res.send("Login Successful");
});


router.post('/changepassword', auth, async (req,res) => {

    const user = await User.findById(req.user._id)
    const {error} = passwordValidation(req.body);
    if(error) return res.status(400).send(error)
    const salt = await bcrypt.genSalt(10);
    const hpass = await bcrypt.hash(req.body.newpassword, salt);

    const doc = await User.findByIdAndUpdate(req.user._id, {password: hpass});

    res.send("Password Changed Successfully");
})


//Exports the file as a module
module.exports = router; 