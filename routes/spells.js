const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const spellsCtrl = require('../controllers/spells');
// Require the auth middleware
const ensureLoggedIn = require('../config/ensureLoggedIn');

// GET /spells
router.get('/spells', spellsCtrl.index);
// GET /spells/:id (show functionality) MUST be below new route
router.get('/spells/:id', spellsCtrl.show);

	
module.exports = router;