'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const Axios = require('axios')
const helmet = require('helmet')
const morgan = require('morgan')
const client = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit')

let count = 0;
const router = express.Router();


require('dotenv').config()
router.use(helmet())
router.use(morgan('combined'))
router.use(cors()) //Uten denne vil man få nettwork error.
router.use(express.json())




router.get('/', (request, response) => {

  count++
  response.json(count)
  });


app.use('/api/ip', router);  // path must route to lambda


module.exports = app;
module.exports.handler = serverless(app);