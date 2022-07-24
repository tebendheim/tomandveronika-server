'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const router = express.Router();
router.use(express.json());
const apiLimiter = require('../middleware/ratelimiter');

//import modules
const youtube = require('./youtube');
const ip = require('./ip');
const sendgrid = require('./sendgrid');
const sendinblue = require('./sendinblue');
const login = require('./login');
const forgotPassword = require('./forgotpassword');
const register = require('./register');
const test = require('./test');

require('dotenv').config();
router.use(helmet());
router.use(morgan('combined'));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});
app.use(
	cors({
		origin: '*',
	})
);
//router.use(cors()); //Uten denne vil man få nettwork error.

//router.get('/ip', (request, response) => response.send(request.ip))

app.use(bodyParser.json());

router.use('/ip', ip);
router.use('/youtube', youtube);
router.use('/sendgrid', sendgrid);
router.use('/sendinblue', sendinblue);
router.use('/login', login);
router.use('/register', register);
router.use('/test', test);
router.use('/forgotpassword', forgotPassword);

app.use('/api', router);
// path must route to lambda

app.set('trust proxy', 1);

module.exports = app;
module.exports.handler = serverless(app);
