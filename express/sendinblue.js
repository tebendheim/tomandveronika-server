'use strict';
const express = require('express');
const app = express();
const Axios = require('axios')
const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const router = express.Router();
const apiLimiter =require('../middleware/ratelimiter')
require('dotenv').config()
router.use(express.json())
const captcha = require('../middleware/captcha')


router.post('/',apiLimiter(2,2), async(req,res)=>{

 //sjekker om det eksisterer en "body"
  if (!req.body.data){
        res.status(400).json({'errors': ['Not authorized request']})
    return;
  } 

	const body = req.body.data ///setting the body

  //reCaptcha
  const resCaptcha = captcha(body['token'])
  console.log(resCaptcha)
  if (!resCaptcha){
    res.status(400).json({'errors': ['it seems to be an error with your verification']})
    return;
  } 



  // setting apiKeys og starting the service

  	const email =body['email']
  	const firstName=body['firstName']
  	const lastName=body['lastName']
  	const message = body['message']
  	//const message='Dette burde være meldingen'

	//Making the sender
	const sender = {
    	email: process.env.MY_EMAIL,
    	name: 'Tom-Elbin Bendheim',
		}
	const receivers = [
	    {
	        email: process.env.MY_EMAIL_TO  //body['email'],
	    },
	    {
	    	email: `${email}`
	    }
	]
     const msg =  {
        sender,
        to: receivers,
        subject: 'Form submitted from tomandveronika.com',
        textContent: `
        Hi ${firstName},
        This is a comfirmation that your form has been submitted.


        Name: ${firstName} ${lastName}
        E-mail: ${email}


        Message: 

        "${message}"



        Thank you so much for getting in touch with us.
        We will respond to your email as soon as possible.

        Best regards,
        Tom & veronika

        tomandveronika.com
        `,
        /*htmlContent: `
        <h1>Cules Coding</h1>
        <a href="https://cules-coding.vercel.app/">Visit</a>
                `,*/
        params: {
            role: 'Frontend',
        }
    }
    try{
    	const apiKey = client.authentications['api-key']
		apiKey.apiKey = process.env.SENDINBLUE_API_KEY
		const tranEmailApi = new Sib.TransactionalEmailsApi()
		const blueRespons = await tranEmailApi.sendTransacEmail(msg)
    	res.status(200).json({'body':['kommer denne opp nå?']})
	} catch(err){

	    res.status(400).json({'body':['Server Error']})
	}
})

module.exports = router;