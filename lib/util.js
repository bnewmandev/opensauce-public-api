const chalk = require('chalk');
const User = require('../model/User');
const nodemailer = require('nodemailer')
const role = {
	Admin: ['ADMINISTRATOR'],
	Moderator: ['ADD_INGREDIENT', 'REMOVE_INGREDIENT', 'EDIT_INGREDIENT', 'ADD_COMMENT', 'REMOVE_COMMENT', 'EDIT_COMMENT', 'ADD_POST', 'REMOVE_POST', 'EDIT_POST'],
	Writer: ['ADD_INGREDIENT', 'ADD_POST'],
	User: ['ADD_COMMENT', 'EDIT_COMMENT']
};

exports.log = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[LOG]')} ${chalk.blue(text)}`);
exports.debug = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[DEBUG]')} ${chalk.yellow(text)}`);
exports.error = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[ERROR]')} ${chalk.red(text)}`);
exports.doubles = (val) => val < 10 ? `0${val}` : val;
exports.time = (date) => {
	date = new Date(Date.now());
	let hour = date.getHours();
	const min = date.getMinutes();
	let second = date.getSeconds();
	second = this.doubles(second);
	hour = this.doubles(hour);
	return `${hour}:${min}:${second}`;
};
exports.formatDate = (date) => {
	date = new Date(Date.now());
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 101).toString().substring(1);
	const day = (date.getDate() + 100).toString().substring(1);
	return `${year}-${month}-${day}`;
};

exports.packDate = (date) => {
	date = new Date(Date.now());
	const time = this.time(date);
	const formatDat = this.formatDate(date);
	return `[${formatDat} ${time}]`;
};

exports.sendRegisterEmail = async (user) => {
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
		  user: process.env.EMAIL_USER,  
		  pass: process.env.EMAIL_PASS,
		},
	  });
	let sender = await transporter.sendMail({
		from: `${user.name} <${user.email}>`, 
		to: user.email,
		subject: "Welcome to OpenSauce!",
		text: this.buildEmailPlain(user),
		html: this.buildEmailHTML(user),
	  });
	return sender.messageId
};

exports.buildEmailHTML = (user) => {
	 const email = `<h1 style="text-align: center;"><img style="display: block; margin-left: auto; margin-right: auto;" src="http://cdn.opensauce.uk/assets/black_logo.png" alt="Logo" width="118" height="118" /><br />Welcome to OpenSauce</h1>
	 <p style="text-align: center;">Hello ${user.name},<br />Thank you for signing up to OpenSauce attached you'll find a list of all your details for record-keeping.<br /><br />Link to our website: <a title="OpenSauce" href="https://opensauce.uk" target="_blank" rel="noopener">https://opensauce.uk</a><br />Email: ${user.email}<br />Username: ${user.username}<br /><br />I thank you for signing up to our service if you do require help you can contact us at <a href="mailto: teamopensauceuk@gmail.com">teamopensauceuk@gmail.com</a><br /><br />Best regards,<br />OpenSauce Team<br /><br /></p>`;
	 return email;
};
exports.buildEmailPlain = (user) => {
	const emailPlain = `Hello ${user.name},\n\nThank you for signing up to OpenSauce attached you'll find a list of all your details for record-keeping.\n\nLink to our website: https://opensauce.uk\nEmail: ${user.email}\nUsername: ${user.username}\n\nI thank you for signing up to our service if you do require help you can contact us at teamopensauceuk@gmail.com\n\nBest regards,\nOpenSauce Team`;
	return emailPlain;
};
exports.checkPermission = async (user, permission) => {
	try {
		// Define
		user = await User.findOne({ username: user.username });
		let user_permissions = user.permissions;
 		let user_role_perms = role[user.role];
		let i;
		// Loop add permissions from role
		if (!user_role_perms) user_role_perms = role.User;
		for (i = 0; i < user_role_perms.length; i++) {
			user_permissions.push(user_role_perms[i]);
		}
		// Removve duplicates
		user_permissions = new Set(user_permissions);
		user_permissions = [...user_permissions];

		// Permission checking
		if (user_permissions.includes('ADMINISTRATOR')) return true; // If user has ADMINISTRATOR return true
		if (!user_permissions.includes(permission)) return false; // If user doesn't have permission return false
		if (user_permissions.includes(permission)) return true; // If user does have permission return true
		return false; // return false just in case as its better an operation is cancelled if the validity of the permission is in question
	} catch (error) {
		console.log(error);
		return false;
	}
};

exports.logDate = () => chalk.bgMagenta(this.packDate());
