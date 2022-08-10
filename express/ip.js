'use strict';

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const rateLimit = require('express-rate-limit');
const router = express.Router();
require('dotenv').config();
const apiLimiter = require('../middleware/ratelimiter');
router.use(express.json());
const db = require('../models');
const Session = db.session;

let count = 0;

router.post('/', (req, res) => {
	//console.log(req.socket.remoteAddress);
	const ip = req.headers['x-forwarded-for'];
	console.log(ip);
	const session = new Session({ ip: ip });
	await session.save()
	res.json('ok?');
	return;
});

module.exports = router;

//module.exports.handler = serverless(app);
