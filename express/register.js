const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const normalize = require('normalize-url');
require('dotenv').config();
const connect = require('../functions/db');
const cap = require('../functions/firstLetter');
const captcha = require('../middleware/captcha');

// get usermodel
const db = require('../models');
const User = db.user;
const Role = db.role;

//@route    POST api/register
// @desc    register user
// @access  Public

router.post(
	'/',
	[
		check('name', 'Please enter a valid name').not().isEmpty(),
		check('email', 'Please enter a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
		check(
			'confirmPass',
			'Please enter password confirmation with 6 or more characters.'
		).isLength({
			min: 6,
		}),
	],
	cors({
		origin: '*',
	}),
	//captcha,
	async (req, res) => {
		const errors = validationResult(req.body);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		const { email, password, confirmationPass } = req.body.data;
		if (password !== confirmationPass) {
			res.status(400).json({ error: 'passwords do not match' });
			return;
		}

		const admin = false;

		// @Todo: make Name capitalized.
		//const fName =
		//	String(firstName)[0].toUpperCase + firstName.substring(1).toLowerCase;
		//	const lName = lastName[0].toUpperCase + lastName.substring(1).toLowerCase;

		try {
			connect();
			// See if user exists
			const exist = await User.findOne({ email });
			if (exist) {
				res.status(400).json({ errors: [{ msg: 'user already exists' }] });
				return;
			}
			const firstName =
				req.body.data.firstName[0].toUpperCase() +
				req.body.data.firstName.substring(1).toLowerCase();
			const lastName =
				req.body.data.lastName[0].toUpperCase() +
				req.body.data.lastName.substring(1).toLowerCase();
			const name = `${firstName} ${lastName}`;

			//Encrypt password
			const salt = await bcrypt.genSalt(10);
			const cryptPassword = await bcrypt.hash(password, salt);

			const role = await Role.findOne({ name: 'user' });
			const user = new User({
				name,
				email,
				//password: cryptPassword,
				password: cryptPassword,
				roles: role._id,
			});

			await user.save();

			// Retur json webtoken
			console.log(user);
			const payload = {
				user: {
					id: user._id,
					auth: admin,
				},
			};
			const secret = process.env.JWT_SECRET;
			const mainToken = jwt.sign(payload, secret, {
				algorithm: 'HS256',
				expiresIn: 360000,
			});
			res.json(mainToken);
			return;
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
			return;
		}
	}
);

module.exports = router;
