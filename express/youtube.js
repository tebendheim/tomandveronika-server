'use strict';
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const Axios = require('axios')
const helmet = require('helmet')
const morgan = require('morgan')
const router = express.Router();
require('dotenv').config()
router.use(helmet())
router.use(morgan('combined'))
router.use(cors()) //Uten denne vil man få nettwork error.
router.use(express.json())

//middleware
const apiLimiter = require('../middleware/ratelimiter')

let cachedData;
let cachedTime;


// Denne bruker jeg.
router.get('/', apiLimiter(2,2) , async(req, res) => {
  if (cachedData && cachedTime > Date.now()-3*60*60*1000)/*Oppdateres hver 3 timer*/{
    res.json(cachedData)
    return;
  }
  const options={
    method:"GET",
//url:`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${process.env.PLAYLISTID}&key=${process.env.API_KEY_YOUTUBE}`,
    url:`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet`,
    headers:{
      'content-type':'application/JSON',
      },
    params: {
      maxResults:req.headers['maxresults'],
      playlistId:process.env.PLAYLISTID,
      key:process.env.API_KEY_YOUTUBE
    }
    }
  try{
      const ax = await Axios.request(options);
      cachedTime = Date.now()
      cachedData = ax.data
      res.json(ax.data)
  } catch(err){
      res.send(err)
  }
})



module.exports = router;
