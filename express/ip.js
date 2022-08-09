'use strict';

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const rateLimit = require('express-rate-limit');
const router = express.Router();
require('dotenv').config();
const apiLimiter = require('../middleware/ratelimiter');
router.use(express.json());

let count = 0;

router.post('/', (request, response) => {
	console.log(request);
	return response.json(request.body);
});

module.exports = router;

//module.exports.handler = serverless(app);
