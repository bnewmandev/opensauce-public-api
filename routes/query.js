const router = require('express').Router();
const Search = require('../model/Search');

router.post('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!' });
});


router.get('/search', async (req, res) => {
	const regex = new RegExp(req.body.query, 'i');
	const rawList = await Search.find({ name: regex }).select('-__v');
	res.json({
		results: rawList
	});
});


module.exports = router;
