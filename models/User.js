const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	admin: {
		type: Boolean,
		default: false,
	},
	showAdmin: {
		type: Boolean,
		default: false,
	},
	resetLink: {
		data: String,
		default: '',
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model('User', UserSchema);
