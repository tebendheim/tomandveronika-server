
// imports
const express = require('express');
const cors = require('cors');
const Axios = require('axios');
const helmet = require('helmet');
const morgan = require('morgan');
const client = require('@sendgrid/mail');
const youtube =require('./api/youtube');
const sendgrid = require('./api/sendgrid');
const youtubepost = require('./api/youtubepost');

//client.setApiKey(process.env.SENDGRID_API_KEY);
//const bodyParser = require('body-parser')

require('dotenv').config()


// setting listening and Cache
const http = require('http');
const hostname='127.0.0.1';
const port = 5001;


// Setting express as app and make it use the imports
const app = express()
//app.use(bodyParser.json())
app.use(helmet())
app.use(morgan('combined'))
app.use(cors()) //Uten denne vil man få nettwork error.
app.use(express.json())
app.use('/api/youtube',youtube)
app.use('/api/sendgrid', sendgrid)
app.use('/api/youtubepost', youtubepost)


app.listen(port, () => {console.log(`Server is running on port ${port}`)}) //Denne setter i gang listening to server