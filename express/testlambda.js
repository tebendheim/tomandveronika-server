'use strict';
const axios = require('axios');
let newValue = 0;

function updateDatabase() {
	newValue++;
	return null;
}

module.exports.handler = async function (event, response) {
	//console.log("EVENT: \n" + JSON.stringify(event, null, 2))
	let Ipadress;
	const ax = await axios
		.get('https://geolocation-db.com/json/')
		.then((res) => {
			console.log(res.data.IPv4);
			Ipadress = res.data.IPv4;
			updateDatabase();
			return res.data.IPv4;
		})
		.catch((err) => {
			console.log(err);
		});

	return {
		statusCode: 200,
		body: JSON.stringify({ number: newValue, IP: Ipadress }),
	};
};

/*
      return {
      statusCode: 200,
      body: JSON.stringify ({number:newValue, IP:IPadress})

      */
