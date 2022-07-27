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
const Role = db.role;

router.get(
	'/:role',
	cors({ origin: 'http://localhost:8888' }),
	async (req, res) => {
		connect();
		const Name = req.params.role;
		//check if role with name already exists
		const oldRole = Role.findOne({ Name });
		if (oldRole) {
			res.status(400).json({ error: { msg: 'Role already exists' } });
			return;
		}
		const role = new Role({
			name: Name,
		});
		await role.save();
		res.json({ msg: role });
		return;
	}
);

module.exports = router;
