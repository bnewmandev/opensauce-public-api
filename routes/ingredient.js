const router = require('express').Router();
const auth = require('./verifyToken');
const Search = require('../model/Search');
const Ingredient = require('../model/Ingredient');
const util = require('../lib/util');

router.post('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!' });
});

router.post('/add', auth, async (req, res) => {
	if (!util.checkPermission(req.user, 'ADD_INGREDIENT')) {
		return res.status(403).send({ error: 'Please contact an admin to request the needed permission to perform this operation', permission: 'ADD_INGREDIENT' });
	}

	const ingredient = new Ingredient({
		name: req.body.name,
		image: req.body.image
	});

	const search = new Search({
		type: 'Ingredient',
		referenceid: ingredient._id,
		name: ingredient.name,
		link: `/ingredients/${ingredient.name}`
	});

	try {
		const newIng = await ingredient.save();
		const newSearch = await search.save();
		res.status(201).send({ payload: ingredient });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});


module.exports = router;
