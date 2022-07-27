const mongoose = require('mongoose');
const TestSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = Test = mongoose.model('test', TestSchema);
