const axios = require('axios');
const Axios = require('axios');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
require('dotenv').config();

const sendResetMail = async (msg) => {
	try {
		const apiKey = client.authentications['api-key'];
		apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
		const tranEmailApi = new Sib.TransactionalEmailsApi();
		await tranEmailApi
			.sendTransacEmail(msg)
			.then((res) => {
				return;
			})
			.catch((err) => {
				return err;
			});
	} catch (err) {
		res.status(400).json(err);
		return err;
	}
};

module.exports = sendResetMail;
