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
app.use(cors());
router.use(cors()); //Uten denne vil man få nettwork error.

router.get('/', apiLimiter, (req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('<h1>Hello from Express.js!</h1>');
	res.end();
});

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
