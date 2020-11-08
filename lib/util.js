const chalk = require('chalk');
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

exports.logDate = () => chalk.bgMagenta(this.packDate());