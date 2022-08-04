const express = require('express');
const connect = require('../functions/db');
const router = express.Router();
const auth = require('../middleware/auth');

require('dotenv').config();

// get usermodel
const db = require('../models');
const { findById } = require('../models/user.model');
const User = db.user;
const Role = db.role;

router.get(
	'/addrole/:role/:user',
	auth.verifyToken,
	auth.isAdmin,
	async (req, res) => {
		try {
			connect();
			const user = await User.findById(req.params.user);
			const role = await Role.findOne({ name: req.params.role });
			if (!role) {
				res.json({ error: 'Role does not exist' });
				return;
			}
			let roleExist = false;
			user.roles.map((userRole) => {
				if (userRole.equals(role._id)) {
					roleExist = true;
				}
			});
			if (roleExist) {
				res.json({ error: 'User already have this role' });
				return;
			}
			user.roles.push(role);
			user.save();
			return res.json({ msg: 'User previliges updated' });
		} catch (err) {
			return res.json({ msg: 'An error occured!', error: err });
		}
	}
);
router.get(
	'/removerole/:role/:user',
	auth.verifyToken,
	auth.isAdmin,
	async (req, res) => {
		try {
			connect();
			const role = await Role.findOne({ name: req.params.role });
			if (!role) {
				return res.json({ error: 'Role does not exist' });
			}
			const user = await User.findById(req.params.user);
			if (!user) {
				return res.json({ error: 'user does not exist' });
			}
			user.roles.pull(role);
			user.save();
			return res.json('it worked');
		} catch (err) {
			return res.json({ error: err });
		}
	}
);

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
