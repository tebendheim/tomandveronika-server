const express = require('express')
const router = express.Router()
const cors = require('cors')
const Axios = require('axios')
const helmet = require('helmet')
const morgan = require('morgan')

require('dotenv').config()

router.use(helmet())
router.use(morgan('combined'))
router.use(cors()) //Uten denne vil man få nettwork error.
router.use(express.json())


router.get('/', async function youtube(req, res) {    
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
      res.json(ax.data)
  } catch(err){
      res.send(err)
  }
})

module.exports = router;