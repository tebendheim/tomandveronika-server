//imports
const Axios = require('axios');
require('dotenv').config();

//Dette fungerer. må da kalle den som en funksjon fra sendgrid.

/*
const captcha = async (token) => {
	const rescaptcha = token;
	const capURL = `https://www.google.com/recaptcha/api/siteverify`;
	const capParams = {
		params: {
			secret: process.env.REC_SECRET_KEY,
			response: rescaptcha,
		},
	};
	//console.log(resCaptcha)
	const capResponse = await Axios.get(capURL, capParams);
	const isHuman = capResponse.data['success'];
	//const isHuman = false // Dette er bare for testingsmuligheter
	if (!isHuman) {
		return false;
	}
};

module.exports = captcha;
//*/


module.exports = async function (req, res, next) {
	const body = req.body.data; ///setting the body
	const token = body['token'];
	const rescaptcha = token;
	const capURL = `https://www.google.com/recaptcha/api/siteverify`;
	const capParams = {
		params: {
			secret: process.env.REC_SECRET_KEY,
			response: rescaptcha,
		},
	};
	//console.log(resCaptcha)
	const capResponse = await Axios.get(capURL, capParams);
	const isHuman = capResponse.data['success'];
	//const isHuman = false // Dette er bare for testingsmuligheter
	if (!isHuman) {
		res
			.status(400)
			.json({ errors: ['it seems to be an error with your verification'] });
	}
	next();
};

//*/
