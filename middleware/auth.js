'use strict';
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connect = require('../functions/db');

const db = require('../models');
const User = db.user;
const Role = db.role;

/*
module.exports = function (req, res, next) {
	// get token from header
	const token = req.header('x-auth-token');
	
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
			res.status(401).json({ msg: 'Token is not valid' });
		}
	}
}; */

const verifyToken = (req, res, next) => {
	// get token from header
	const token = req.header('x-auth-token');

	// check if no token
	if (!token) {
		res.status(401).json({ msg: 'no access' });
		return;
	} else {
		// Verify token

		const secret = process.env.JWT_SECRET;
		const decoded = jwt.verify(
			token,
			secret,
			{ algorithm: 'HS256' },
			(err, decoded) => {
				if (err) {
					return res.status(401).json({ message: '2: Unauthorized!' });
				}
				req.userId = decoded.user.id;
				next();
			}
		);

		/*
	const token = req.headers['x-auth-token'];
	const secret = process.env.JWT_SECRET;
	if (!token) {
		res.status(402).json({ message: '1: No token provided!' }); // husk å fjerne 1
		return;
	}
	jwt.verify(token, secret, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: '2: Unauthorized!' });
		}
		req.userId = decoded.id;
		next();
	});*/
	}
};

const isAdmin = (req, res, next) => {
	connect();
	User.findById(req.userId).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		Role.find(
			{
				_id: { $in: user.roles },
			},
			(err, roles) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				for (let i = 0; i < roles.length; i++) {
					if (roles[i].name === 'admin') {
						next();
						return;
					}
				}
				res.status(403).send({ message: 'Require Admin Role!' });
				return;
			}
		);
	});
};
const isModerator = (req, res, next) => {
	connect();
	User.findById(req.userId).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		Role.find(
			{
				_id: { $in: user.roles },
			},
			(err, roles) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				for (let i = 0; i < roles.length; i++) {
					if (roles[i].name === 'user') {
						next();
						return;
					}
				}
				res.status(403).send({ message: 'Require Moderator Role!' });
				return;
			}
		);
	});
};

const authJwt = {
	verifyToken,
	isAdmin,
	isModerator,
};
module.exports = authJwt;
