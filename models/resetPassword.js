const mongoose = require('mongoose');
const resetPasswordSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
		ref: 'user',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 3600,
	},
});
module.exports = mongoose.model('resetPassword', resetPasswordSchema);
