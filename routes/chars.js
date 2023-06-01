const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const charsCtrl = require('../controllers/chars');
// Require the auth middleware
const ensureLoggedIn = require('../config/ensureLoggedIn');
	
// GET /chars
router.get('/chars', charsCtrl.index);

// GET /chars/new
router.get('/chars/new', ensureLoggedIn, charsCtrl.new);

// GET /chars/:id (show functionality) MUST be below new route
router.get('/chars/:id', charsCtrl.show);

// POST /chars
router.post('/users/:id/chars', ensureLoggedIn, charsCtrl.create);
// router.post('/chars', ensureLoggedIn, charsCtrl.create);

// DELETE /chars/:id
router.delete('/chars/:id', ensureLoggedIn, charsCtrl.delete);
	
module.exports = router;