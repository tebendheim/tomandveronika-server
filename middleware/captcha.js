const Axios = require('axios')

require('dotenv').config()

const captcha = async(token) => {
	const rescaptcha = token
  	const capURL= `https://www.google.com/recaptcha/api/siteverify`
  	const capParams={
      params:{
      secret:process.env.REC_SECRET_KEY,
      response:rescaptcha,
    }
  }
  //console.log(resCaptcha)
  const capResponse = await Axios.get(capURL,capParams);
  const isHuman = capResponse.data['success']
  //const isHuman = false // Dette er bare for testingsmuligheter
  if (!isHuman) {
    return false;
  }
}

module.exports = captcha