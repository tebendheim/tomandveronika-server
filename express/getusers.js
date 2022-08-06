const express = require('express');
const connect = require('../functions/db');
const router = express.Router();
const auth = require('../middleware/auth');
const { user } = require('../models');

require('dotenv').config();

// get usermodel
const db = require('../models');
const { findById } = require('../models/user.model');
const User = db.user;

router.get('/getusers', auth.verifyToken, auth.isAdmin, async (req, res) => {
	try {
		connect();
		//henter alle brukere.
		const data = await User.find({ category: 'Database' }, [
			'-password',
			'-__v',
		]).populate('roles', '-__v'); //Populate legger inn alle rollene.

		return res.json(data);
	} catch (err) {
		return res.json({ msg: 'An error occured!', error: err });
	}
});

module.exports = router;

/* hvordan kan jeg oppdatere et mongoosedokument=
			const oldemail = 'test@test.er';
			const newemail = 'test@test.com';
			const user2 = await User.updateOne(
				{ email: oldemail },
				{ email: newemail }
			);
			const user3 = await User.findOne({ email: newemail });
			console.log(user3);

            */
