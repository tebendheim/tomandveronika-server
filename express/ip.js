'use strict';

const express = require('express');

const app = express();

const router = express.Router();
require('dotenv').config();
router.use(express.json());


router.post('/', (req, res) => {
	//console.log(request);
	return res.json('ok');
});

module.exports = router;

//module.exports.handler = serverless(app);
