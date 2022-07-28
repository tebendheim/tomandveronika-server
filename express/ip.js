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

router.get('/', apiLimiter(2, 2), (request, response) => {
	count++;
	response.json(count);
});

module.exports = router;

//module.exports.handler = serverless(app);
