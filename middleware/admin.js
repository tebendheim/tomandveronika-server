'use strict';
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
	// get token from header
	const token = req.header('x-auth-token');
	const secret = process.env.JWT_SECRET;
	// check if no token
	if (!token) {
		res.status(401).json({ msg: 'no access' });
	} else {
		// Verify token
		try {
			const decoded = jwt.verify(token, secret, { algorithm: 'HS256' });
			req.user = decoded.user;
			next();
		} catch (err) {
			res.status(401).json({ msg: 'Token is not valid', token: token });
		}
	}
};