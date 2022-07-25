'use strict';
const express = require('express');

const app = express();
app.use(express.json());

//app.use(express.urlencoded({ extended: true }));

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // or 'localhost:8888'
	res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	return next();
}); // sets headers before routes */

const cors = require('cors');
app.use(
	cors({
		origin: '*',
	})
);
// Sets headers before routes*/
const serverless = require('serverless-http');
const router = express.Router();
const helmet = require('helmet');
const morgan = require('morgan');

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
app.use(helmet());
app.use(morgan('combined'));

//router.use(cors()); //Uten denne vil man få nettwork error.

//router.get('/ip', (request, response) => response.send(request.ip))

app.use('/api/ip', ip);
app.use('/api/youtube', youtube);
app.use('/api/sendgrid', sendgrid);
app.use('/api/sendinblue', sendinblue);
app.use('/api/login', login);
app.use('/api/register', register);
app.use('/api/test', test);
app.use('/api/forgotpassword', forgotPassword);

app.use('/api', router);
// path must route to lambda

app.set('trust proxy', 1);

module.exports = app;
module.exports.handler = serverless(app);
