const router = require('express').Router();
const auth = require('./verifyToken');

router.get('/ping',auth, (req,res) => {
    res.json(
        {
            title: "Pong!",
            user: req.user.username,
            data: req.user
        });
});









module.exports = router; 