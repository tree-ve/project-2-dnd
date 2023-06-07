const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const songsCtrl = require('../controllers/songs');
// Require the auth middleware
const ensureLoggedIn = require('../config/ensureLoggedIn');

// const passport = require('passport');
// const user = require('../models/user');
	
// GET /songs
router.get('/songs', songsCtrl.index);

// GET /songs/new
router.get('/songs/new', ensureLoggedIn, songsCtrl.new);

// GET /songs/:id (show functionality) MUST be below new route
router.get('/songs/:id', songsCtrl.show);

// POST /songs
router.post('/users/:id/songs', ensureLoggedIn, songsCtrl.create);
// router.post('/songs', ensureLoggedIn, songsCtrl.create);

// GET /songs/:id/edit
router.get('/songs/:id/edit', songsCtrl.edit)

// PUT /songs/:id
router.put('/songs/:id', songsCtrl.update)

// DELETE /songs/:id
router.delete('/songs/:id', ensureLoggedIn, songsCtrl.delete);
// router.delete('/songs/:id', ensureLoggedIn, songsCtrl.delete);

// POST /campaigns/:id/songs
router.post('/campaigns/:id/songs', ensureLoggedIn, songsCtrl.addToCampaign);

// POST /campaigns/:id/songs
router.put('/campaigns/:id/songs', ensureLoggedIn, songsCtrl.removeFromCampaign);

module.exports = router;