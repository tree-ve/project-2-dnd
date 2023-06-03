const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const charsCtrl = require('../controllers/chars');
// Require the auth middleware
const ensureLoggedIn = require('../config/ensureLoggedIn');

// const passport = require('passport');
// const user = require('../models/user');
	
// GET /chars
router.get('/chars', charsCtrl.index);

// GET /chars/new
router.get('/chars/new', ensureLoggedIn, charsCtrl.new);

// GET /chars/:id (show functionality) MUST be below new route
router.get('/chars/:id', charsCtrl.show);

// POST /chars
router.post('/users/:id/chars', ensureLoggedIn, charsCtrl.create);
// router.post('/chars', ensureLoggedIn, charsCtrl.create);

// GET /chars/:id/edit
router.get('/chars/:id/edit', charsCtrl.edit)

// PUT /chars/:id
router.put('/chars/:id', charsCtrl.update)

// DELETE /chars/:id
router.delete('/chars/:id', ensureLoggedIn, charsCtrl.delete);
// router.delete('/chars/:id', ensureLoggedIn, charsCtrl.delete);

// ! Need an addToCampaign
// POST /campaigns/:id/chars
router.post('/campaigns/:id/chars', ensureLoggedIn, charsCtrl.addToCampaign);

// ! Need an removeFromCampaign
// POST /campaigns/:id/chars
router.put('/campaigns/:id/chars', ensureLoggedIn, charsCtrl.removeFromCampaign);

module.exports = router;