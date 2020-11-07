const router = require('express').Router();
const auth = require('./verifyToken');

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
            date: req.user.date
    });
});






module.exports = router; 