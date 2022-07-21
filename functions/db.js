const mongo = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
	const URI = process.env.MONGO_URI;
	try {
		mongo.connect(URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const db = mongo.connection;
		db.on('error', console.error.bind(console, 'connection error: '));
		db.once('open', function () {
			console.log('Connected successfully');
		});
		return;
	} catch (err) {
		console.error(err);
		return;
	}
};

module.exports = connectDb;
