const express = require('express');
const router = express.Router();
const cors = require('cors');
const Axios = require('axios');
const helmet = require('helmet');
const morgan = require('morgan');
const client = require('@sendgrid/mail');

let cachedData
let cachedTime

//client.setApiKey(process.env.SENDGRID_API_KEY);
//const bodyParser = require('body-parser')

require('dotenv').config()
router.use(helmet())
router.use(morgan('combined'))
router.use(cors()) //Uten denne vil man få nettwork error.
router.use(express.json())


router.get('/', (req, res) {
  const path = `/api/item/`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

  /*
  try{
    res.json({
      status:200,
      message:"get data is successful"
    })
  } catch(err){
    console.error(err);
    return res.status(500).send("server error")
  }
})*/

module.exports = router;