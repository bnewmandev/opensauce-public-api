const router = require('express').Router();
const Search = require('../model/Search');

router.post('/ping', (req,res) => {
    res.send("Pong!")
});


router.get('/search', async (req,res) => {
    let regex = new RegExp(req.body.query, 'i');
    let rawList = await Search.find({name: regex});
    res.json({
        results: rawList
    })
});





module.exports = router; 
