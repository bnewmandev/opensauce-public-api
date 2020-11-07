const router = require('express').Router();
const Search = require('../model/Search');

router.post('/ping', (req,res) => {
    res.send("Pong!")
});


router.get('/query', async (req,res) => {
    let regex = new RegExp(req.body.query, 'i');
    let rawList = await Search.find({title: regex});
    res.json({
        results: rawList
    })
});





module.exports = router; 
