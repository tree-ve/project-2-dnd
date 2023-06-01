const express = require('express');
const router = express.Router();
const classesCtrl = require('../controllers/classes');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// This router is mounted to a "starts with" path of '/'

// POST /chars/:id/classes (associate a classe with a char)
router.post('/chars/:id/classes', ensureLoggedIn, classesCtrl.addToChar);

module.exports = router;