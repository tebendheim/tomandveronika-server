const mongoose = require('mongoose');
const SessionSchema = new mongoose.Schema({
	ip: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = Session = mongoose.model('test', SessionSchema);
