'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const client = require('@sendgrid/mail');
const router = express.Router();
router.use(express.json())
const apiLimiter = require('../middleware/ratelimiter')

//import modules
const youtube = require('./youtube')
const ip = require('./ip')
const sendgrid = require('./sendgrid')


require('dotenv').config()
router.use(helmet())
router.use(morgan('combined'))
app.use(cors()) //Uten denne vil man få nettwork error.



router.get('/', apiLimiter, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});


//router.get('/ip', (request, response) => response.send(request.ip))

app.use(bodyParser.json());

router.use('/ip', ip);
router.use('/youtube', youtube)
router.use('/sendgrid', sendgrid)

app.use('/api', router);
  // path must route to lambda
  // path must route to lambda

app.set('trust proxy', 1)



module.exports = app;
module.exports.handler = serverless(app);