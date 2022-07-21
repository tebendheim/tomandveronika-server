'use strict';
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const normalize = require('normalize-url');
const db = require('../functions/db');
const Test = require('../models/test');
const connect = require('../functions/db');
require('dotenv').config();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
	res.json({ msg: 'dette er en test' });
});

module.exports = router;
