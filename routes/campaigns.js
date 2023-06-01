const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const campaignsCtrl = require('../controllers/campaigns');
// Require the auth middleware
const ensureLoggedIn = require('../config/ensureLoggedIn');
	
// GET /campaigns
router.get('/campaigns', campaignsCtrl.index);
// GET /campaigns/new
router.get('/campaigns/new', ensureLoggedIn, campaignsCtrl.new);
// GET /campaigns/:id (show functionality) MUST be below new route
router.get('/campaigns/:id', campaignsCtrl.show);
// POST /campaigns
router.post('/campaigns', ensureLoggedIn, campaignsCtrl.create);
	
module.exports = router;