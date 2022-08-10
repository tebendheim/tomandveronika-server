'use strict';

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const rateLimit = require('express-rate-limit');
const router = express.Router();
require('dotenv').config();
router.use(express.json());

let count = 0;

router.get('/', (request, response) => {
	count++;
	response.json(count);
});

module.exports = router;

//module.exports.handler = serverless(app);
