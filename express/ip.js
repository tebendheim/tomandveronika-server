'use strict';

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const rateLimit = require('express-rate-limit');
const router = express.Router();
require('dotenv').config();
router.use(express.json());
const connect = require('../functions/db');

//get models
// get usermodel
const db = require('../models');
const User = db.user;
const Role = db.role;
const Ses = db.session;

let count = 0;

router.get('/', (req, res) => {
	const ip = req.headers['x-forwarded-for'];
	const test = 'dette er en test';
	connect();
	const session = new Ses({
		ip: ip,
	});
	session.save();
	count++;
	console.log(session);
	res.json(count);
});

module.exports = router;

//module.exports.handler = serverless(app);
