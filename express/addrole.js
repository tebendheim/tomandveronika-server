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

const addroles = (roles) => {};

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
			if (role.name === 'admin') {
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

//test
router.get('/adduserrole/:role/:user', async (req, res) => {
	try {
		connect(); // connecting to mongoose
		const user = await User.findById(req.params.user).populate('roles', '-__v'); // finding user
		const roles = await Role.find({
			// finding all roles
			name: { $in: ['admin', 'moderator', 'user'] },
		});
		if (req.params.role === 'role') {
			// skal slette alle roller
			// må legge til admin
			roles.map((role) => {
				if (user.roles.some((userRole) => role.name === userRole.name)) {
					user.roles.pull(role);
				}
			});
			console.log(user);
			user.save();
			return res.json({ user: user, msg: 'success' });
		}

		if (req.params.role === 'admin') {
			//if requested role is admin
			var exist = false;
			user.roles.map((role) => {
				// checking if user have the admin role
				if (role.name === 'ROLE_admin') {
					exist = true;
				}
			});
			if (exist) {
				return res.json('rolle eksisterer');
			}
			// må legge til alle roller
			roles.map((role) => {
				if (!user.roles.some((userRole) => role.name === userRole.name)) {
					user.roles.push(role);
				}
			});
			console.log(user);
			user.save();
			return res.json({ user: user, msg: 'success' });
		}
		if (req.params.role === 'moderator') {
			//if requested role is moderator
			var exist = false;
			user.roles.map((role) => {
				// checking if user have the admin role
				if (role.name === 'ROLE_moderator') {
					exist = true;
				}
			});
			if (exist) {
				return res.json('rolle eksisterer');
			}
			// må legge til admin
			roles.map((role) => {
				if (role.name !== 'admin') {
					if (!user.roles.some((userRole) => role.name === userRole.name)) {
						user.roles.push(role);
					}
				} else {
					if (user.roles.some((userRole) => role.name === userRole.name)) {
						user.roles.pull(role);
					}
				}
			});
			console.log(user);
			user.save();
			return res.json({ user: user, msg: 'success' });
		}
		if (req.params.role === 'user') {
			//if requested role is user
			var exist = false;
			user.roles.map((role) => {
				// checking if user have the admin role
				if (role.name === 'ROLE_user') {
					exist = true;
				}
			});
			if (exist) {
				return res.json('rolle eksisterer');
			}
			// må legge til admin
			roles.map((role) => {
				if (role.name === 'admin' || role.name === 'moderator') {
					if (user.roles.some((userRole) => role.name === userRole.name)) {
						user.roles.pull(role);
					}
				} else {
					if (!user.roles.some((userRole) => role.name === userRole.name)) {
						user.roles.push(role);
					}
				}
			});
			console.log(user);
			user.save();
			return res.json({ user: user, msg: 'success' });
		}
		if (!roles.some((role) => role.name === req.params.role)) {
			// checking if roles requested exist in roles
			return res.json('role does not exist');
		}
	} catch (err) {
		console.log(err);
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
