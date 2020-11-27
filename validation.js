const { object } = require('@hapi/joi');
const Joi = require('@hapi/joi');
const { schema } = require('./model/User');

// Register validation
const registerValidation = (data) => {
	const schema = {
		username: Joi.string().min(6).max(16).required(),
		name: Joi.string().min(3).max(32).required(),
		email: Joi.string().email().min(6).max(32).required(),
		password: Joi.string().min(6).max(32).required()
	};
	return Joi.validate(data, schema);
};

// Login validation
const loginValidation = (data) => {
	const schema = {
		username: Joi.string().min(6).max(16).required(),
		password: Joi.string().min(6).max(32).required()
	};
	return Joi.validate(data, schema);
};

// Post validation
const postValidation = (data) => {
	const schema = {
		title: Joi.string().min(8).max(32).required(),
		body: Joi.string().min(8).max(4096).required(),
		image: Joi.string().max(256)
	};
	return Joi.validate(data, schema);
};

// Comment Validation
const commentValidation = (data) => {
	const schema = {
		title: Joi.string().max(32).min(8).required(),
		body: Joi.string().max(2048).min(8).required(),
		postid: Joi.string().max(32).min(24).required()
	};
	return Joi.validate(data, schema);
};
const deleteCommentValidation = (data) => {
	const schema = {
		postid: Joi.string().max(32).min(24).required(),
		commentid: Joi.string().max(32).min(24).required()
	};
	return Joi.validate(data, schema);
};
// Password change validation
const passwordValidation = (data) => {
	const schema = {
		new_password: Joi.string().min(6).max(32).required(),
		old_password: Joi.string().min(6).max(32).required()
	};
	return Joi.validate(data, schema);
};

// User change validation
const userChangeValidation = (data) => {
	const schema = {
		biography: Joi.string().max(512),
		favorites: Joi.object(),
		avatar: Joi.string().max(300)

	};
	return Joi.validate(data, schema);
};

const deletePostValidation = (data) => {
	const schema = {
		postid: Joi.string().required()
	};
	return Joi.validate(data, schema);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.commentValidation = commentValidation;
module.exports.deleteCommentValidation = deleteCommentValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.userChangeValidation = userChangeValidation;
module.exports.deletePostValidation = deletePostValidation;
