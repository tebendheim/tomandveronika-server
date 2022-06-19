'use strict';
const express = require('express');
const app = express();
const Axios = require('axios')
const client = require('@sendgrid/mail');
const router = express.Router();
const apiLimiter =require('../middleware/ratelimiter')
require('dotenv').config()
router.use(express.json())
const captcha = require('../middleware/captcha')



router.post('/', apiLimiter(2,2) async(req, res) => {
  if (!req.body.data){
        res.status(400).json({'errors': ['Not authorized request']})
    return;
  }
  const body = req.body.data
  const resCaptcha = captcha(body['token'])
  console.log(resCaptcha)
  if (!resCaptcha){
    res.status(400).json({'errors': ['it seems to be an error with your verification']})
    return;
  } 
  

/*
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
  } //

  */

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



});

//*/


router.get('/', (req, res) => {
  const rescaptcha=captcha(true)
  if (!rescaptcha){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Captcha was wrong</h1>');
    res.end();
    }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js! sendgrid</h1>');
  res.end();
});



module.exports = router;