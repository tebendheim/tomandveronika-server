'use strict';
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const normalize = require('normalize-url');
const cors = require('cors');

const Test = require('../models/test.model');
const connect = require('../functions/db');
require('dotenv').config();
const auth = require('../middleware/auth');
const db = require('../models');
const apiLimiter = require('../middleware/ratelimiter');
const Role = db.role;

router.get(
	'/:role',
	//apiLimiter(2, 2),
	cors({ origin: 'http://localhost:8888' }),
	async (req, res) => {
		connect();

		const roleName = req.params.role;
		//check if role with name already exists
		try {
			const oldRole = await Role.findOne({ name: roleName });
			console.log(oldRole);
			//console.log(roleName);

			if (oldRole) {
				res.status(400).json({
					error: { msg: 'Role already exists' },
				});
				return;
			}

			const role = new Role({
				name: roleName,
			});
			await role.save();
			res.json({ msg: role });
			return;
		} catch (err) {
			console.log(err);
			res.json(err);
			return;
		}
	}
);

module.exports = router;
