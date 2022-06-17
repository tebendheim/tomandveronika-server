const express = require('express')
const router = express.router()
const cors = require('cors')
const Axios = require('axios')
const helmet = require('helmet')
const morgan = require('morgan')
const client = require('@sendgrid/mail');

//client.setApiKey(process.env.SENDGRID_API_KEY);
//const bodyParser = require('body-parser')

require('dotenv').config()
router.use(helmet())
router.use(morgan('combined'))
router.use(cors()) //Uten denne vil man få nettwork error.
router.use(express.json())


router.post('/', async(req, res) => {
	  const body = req.body.data
  const captcha = body['token']
  const capURL= `https://www.google.com/recaptcha/api/siteverify`
  const capParams={
      params:{
      secret:process.env.REC_SECRET_KEY,
      response:captcha,
    }
  }
  const capResponse = await Axios.get(capURL,capParams);
  const isHuman = capResponse.data['success']
  //const isHuman = false // Dette er bare for testingsmuligheter
  if (!isHuman) {
    res.status(400).json({'errors': ['it seems to be an error with your verification']})
    return;
  } //*/

  //Denne res skal kommenters bort når hele funksjonen skal brukse.
  //res.status(200).json({'body':['Is a human']})

    const apiKey = process.env.SENDGRID_API_KEY
    client.setApiKey(apiKey);
    const message = {
      to:body['email'],
      from:process.env.MY_EMAIL,
      subject:'Nytt kontaktskjema fra tomandvero.com er mottatt',
      text:`Hei \n${body['message']}`
    }
try{
      const gridResponse = await client.send(message);
      res.status(200).json({'body':['kommer denne opp nå?']})
      console.log(gridResponse)
      return(gridResponse)
    } catch(error) {
      res.status(400).json({'body':['Server Error']})
      return (error);
    };


})



module.exports = router;