const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, passwordValidation, userChangeValidation } = require('../validation');
const dotenv = require('dotenv');
const auth = require('./verifyToken');
const Search = require('../model/Search');
const blacklist = require('../lib/blacklist.json');
const util = require('../lib/util');
dotenv.config();

router.get('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!' });
});

// Create user
router.post('/register', async (req, res) => {
	// Validation
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	if (blacklist.usernames.includes(req.body.username)) return res.status(403).send({ error: 'The username you entered has been blacklisted' });
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
		await util.sendRegisterEmail(user);
		return res.status(201).send({
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
	if (!user) {
		res.status(404).send({
			error: 'The username you entered does not exist.',
			userExist: false
		});
	}

	// If user doesn't exist?
	if (!user) res.status(404).send('The user does not exist!');
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
		avatar: user.avatar,
		biography: user.bio,
		role: user.role
	}, process.env.TOKEN_SECRET);

	res.header('Authorization', token);

	res.status(200).send({ message: 'Login Successful' });
});


router.put('/password/change', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	const { error } = passwordValidation(req.body);
	if (error) { return res.status(400).send({ error: error.details[0].message }); }
	const salt = await bcrypt.genSalt(10);
	const hpass = await bcrypt.hash(req.body.new_password, salt);

	const doc = await User.findByIdAndUpdate(req.user._id, { password: hpass });

	res.status(200).send({ message: 'Password Changed Successfully' });
});

router.get('/info', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	return res.json({
		id: user._id,
		username: user.username,
		name: user.name,
		email: user.email,
		date: user.date,
		favorites: user.favorites,
		avatar: user.avatar,
		biography: user.biography
	});
});

router.get('/get/:username', async (req, res) => {
	if (!req.params.username) return res.status(404).send({ error: "Username wasn't provided" })
	const user = await User.findOne({ username: req.params.username } );
	if (!user) return res.status(400).send( { error: 'Could not find username in database!' })
	return res.status(200).send(
		{
			id: user._id,
			username: user.username,
			email: user.email,
			avatar: user.avatar,
			biography: user.biography,
			favorites: user.favorites,
			role: user.role
		}
	)
})

router.put('/edit', auth, async (req, res) => {
	const { error } = userChangeValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	let biography;
	let favorites;
	let avatar;
	if (req.body.biography) biography = await User.findByIdAndUpdate(req.user._id, { biography: req.body.biography });
	if (req.body.favorites) favorites = await User.findByIdAndUpdate(req.user._id, { favorites: req.body.favorites });
	if (req.body.avatar) avatar = await User.updateOne({ id: req.user._id }, { avatar: req.body.avatar });


	return res.send({
		payload: {
			user: {
				id: req.user.id,
				username: req.user.username,
				avatar: req.body.avatar,
				biography: req.body.biography,
				favorites: req.body.favorites
			}
		}
	});
});


// Exports the file as a module
module.exports = router;
