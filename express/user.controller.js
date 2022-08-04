const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/role/all', auth.verifyToken, (req, res) => {
	res.status(200).send('Public Content.');
});

router.get('/role/user', auth.verifyToken, auth.isModerator, (req, res) => {
	res.status(200).send('User Content.');
});
router.get('/role/admin', auth.verifyToken, auth.isAdmin, (req, res) => {
	// Husk at verify token legger til req.userId, slik at denne må komme før andre middlewares.
	res.status(200).send('Admin Content.');
});

module.exports = router;
