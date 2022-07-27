const express = require('express');
const router = express.Router();
const app = express();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const normalize = require('normalize-url');
const auth = require('../middleware/auth');
const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
const sendMail = require('../functions/sendResetMail');
router.use(express.json());
const cors = require('cors');

require('dotenv').config();
// get usermodel
const User = require('../models/user.model');
const Token = require('../models/resettoken.model');
const { append } = require('vary');
app.use(cors());

// get usermodel
// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route    POST api/auth
// @desc    register user
// @access  Public
// @todo	Denne må sjekkes om fungerer. Her er koden bare hentet fra tidligere prosjekt.

router.post(
	'/',
	[
		check('email', 'Please enter a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			// See if user exists
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// check password
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}
			var roles = [];
			user.roles.map((i) => {
				roles.push('ROLE_' + i.name.toUpperCase());
			});
			// Retur json webtoken
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({
						accessToken: token,
						UserId: user.id,
						name: user.name,
						email: user.email,
						Roles:roles,
					});
				}
			);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

//@path	/login/resetpassword
/*@todo
	Sjekke om JWT er gyldig,
	oppdatere database med nytt passord
	slette linken fra databasen, slik at den ikke kan brukes igjen.
	sørge for at en token MÅ være inkludert for å sette nytt passord.
	bør kanskje sette denne linken i databasen til å være en eller annen form for hashet passord i mellomtiden, slik at det ikke er mulig å utnytte dette.
	
*/
/* @ Må sendes: 
	headers: x-auth-token
	body: newPassword, repeatPassword */

router.post(
	'/resetpassword',
	captcha,
	/**/ async (req, res) => {
		connect();
		try {
			const secret = process.env.JWT_RESET_PASSWORD;
			const reqToken = req.headers['x-auth-token'];
			let decoded;
			if (!reqToken) {
				return res.status(400).json({ errors: [{ msg: 'missing token' }] });
			}
			//@destructure token & // @check if valid token
			try {
				decoded = jwt.verify(reqToken, secret, { algorithm: 'HS256' });
			} catch (err) {
				return res.status(400).json({ errors: [{ msg: 'token error' }] });
			}

			//@find user._id fra token
			const user = decoded.user.id;

			//@connect to database and get token from database

			const databaseToken = await Token.findOne({ userId: user });
			const storedToken = databaseToken.token;

			//@comparing reqToken and storedToken.
			const validPassword = bcrypt.compare(reqToken, storedToken);
			//@sending error if token is not equal to each other.
			if (!validPassword) {
				return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
			}

			//@ getting new password from req
			const { newPassword, repeatPassword } = req.body;

			if (newPassword != repeatPassword) {
				return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
			}
			// hasing new password
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(newPassword, salt);

			//@getting user and updating password.
			const baseUser = await User.findOne({ _id: user });
			await baseUser.updateOne({ password: hash });
			res.json('Password is updated.');
		} catch (err) {
			console.error(err);
		}
	}
);
//*/

app.use('/', router);

module.exports = app;
