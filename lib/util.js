const chalk = require('chalk');
let role = {
    Admin: ["ADMINISTRATOR"],
    Moderator: ["ADD_INGREDIENT", "REMOVE_INGREDIENT", "EDIT_INGREDIENT", "ADD_COMMENT", "REMOVE_COMMENT", "REMOVE_COMMENT", "EDIT_COMMENT", "ADD_POST", "REMOVE_POST", "EDIT_POST"],
    Writer: ["ADD_INGREDIENT", "ADD_POST"],
    User: ["ADD_COMMENT", "EDIT_COMMENT", "DELETE_COMMENT"]	
}

exports.log = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[API]')} ${chalk.blue(text)}`);
exports.debug = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[DEBUG]')} ${chalk.yellow(text)}`);
exports.error = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[ERROR]')} ${chalk.red(text)}`);
exports.auth = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[AUTH]')} ${chalk.magenta(text)}`);
exports.info = (text) => console.log(`${this.logDate()} ${chalk.bgGrey('[INFO]')} ${chalk.blue(text)}`);
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

exports.checkPermission = (user, permission) => {
	try {
		// Define
		let user_permissions = user.permissions
 		let user_role_perms = role[user.role]
		let i;
		// Loop add permissions from role
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
 } catch(error) {
		console.log(error)
		return false
	}
	};

exports.logDate = () => chalk.bgMagenta(this.packDate());
