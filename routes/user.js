const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, passwordValidation } = require('../validation');
const dotenv = require('dotenv');
const auth = require('./verifyToken');
const Search = require('../model/Search');

dotenv.config();

router.get('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!' });
});

// Create user
router.post('/register', async (req, res) => {
	// Validation
	const { error } = registerValidation(req.body);
	if (error) { return res.status(400).send({ error: error.details[0].message }); }

	// Checking if username is already in the database
	const usernameExist = await User.findOne({ username: req.body.username });
	if (usernameExist) {
		return res.status(409).send({
			error: 'Sorry the username already is taken.',
			userExist: true
		});
	}

	// Checking if email is already in the database
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) {
		return res.status(409).send({
			error: 'Sorry the email is already being used.',
			emailExist: true
		});
	}

	// Password Hashing
	const salt = await bcrypt.genSalt(10);
	const hpass = await bcrypt.hash(req.body.password, salt);

	const d = new Date();
	const epoch = d.getTime();

	const user = new User({
		// Data that is recieved from the body of the post
		username: req.body.username,
		name: req.body.name,
		email: req.body.email,
		password: hpass,
		created_at: epoch
	});

	const search = new Search({
		type: 'author',
		referenceid: user._id,
		name: user.username,
		link: `/users/${user._id}`
	});

	try {
		const newUser = await user.save();
		const newSearch = await search.save();
		res.status(201).send({
			message: 'Successfully created user',
			user: user._id
		});
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

// login
router.post('/login', async (req, res) => {
	// Validation
	const { error } = loginValidation(req.body);
	if (error) { return res.status(400).send(error); }

	// Checking if username is already in the database
	const user = await User.findOne({ username: req.body.username });
	console.log(user);
	if (!user) {
		res.status(404).send({
			error: 'The username you entered does not exist.',
			userExist: false
		});
	}

	// Checking if password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		return res.status(401).send({
			error: "The password you entered wasn't correct",
			validPassword: false
		});
	}

	// Create & assign a token
	const token = jwt.sign({
		_id: user._id,
		name: user.name,
		username: user.username,
		email: user.email,
		created_at: user.created_at,
		favorites: user.favorites,
		profilepicture: user.profilepicture,
		biography: user.bio,
		accesslevel: user.permissions
	}, process.env.TOKEN_SECRET);

	res.header('auth-token', token);

	res.status(200).send({ message: 'Login Successful' });
});


router.post('/password/change', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	const { error } = passwordValidation(req.body);
	if (error) { return res.status(400).send({ error: error.details[0].message }); }
	const salt = await bcrypt.genSalt(10);
	const hpass = await bcrypt.hash(req.body.newpassword, salt);

	const doc = await User.findByIdAndUpdate(req.user._id, { password: hpass });

	res.status(200).send({ message: 'Password Changed Successfully' });
});

router.get('/info', auth, (req, res) => {
	res.json(
		{
			_id: req.user._id,
			username: req.user.username,
			name: req.user.name,
			email: req.user.email,
			date: req.user.date,
			favorites: req.user.favorites,
			profilepicture: req.user.profilepicture,
			biography: req.user.biography
		});
});

router.post('/user/edit', auth, async (req, res) => {
	const { error } = userChangeValidation(req.body);
	if (error) { return res.status(400).send(error); }
	let bioData = null;
	let favData = null;
	if (req.body.biography) {
		console.log(req.user._id);
		bioData = await User.findByIdAndUpdate(req.user._id, { biography: req.body.biography });
	}
	if (req.body.favorites) {
		favData = await User.findByIdAndUpdate(req.user._id, { favorites: req.body.favorites });
	}

	res.send({
		biography: req.body.biography,
		favorites: req.body.favorites
	});
});
// Exports the file as a module
module.exports = router;
