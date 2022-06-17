const express = require('express')
const router = express.router()
const cors = require('cors')
const Axios = require('axios')
const helmet = require('helmet')
const morgan = require('morgan')
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


router.get('/', async(req, res) => {
  console.log(req.body)
  if (true){
    const url =`https://youtube.googleapis.com/youtube/v3/playlistItems?`;
    const params = {
      params:{
          part:'snippet',
          maxResults:50,
          playlistId:process.env.PLAYLISTID,
          key:process.env.API_KEY_YOUTUBE,
      },
      headers:{
          'content-type':'application/JSON',
      },
      }
      try {
        const ac = await Axios.get(url, params);
        res.json(ac.data)
      } 
      catch(err){
        res.send(err)
      }}

  else{
        res.json('user not authenticated')
  }
})

module.exports = router;
