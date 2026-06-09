const express = require('express');
const router = express.Router();
const { createTeam, joinTeam } = require('../controllers/teamController');
const { protect } = require('../middlewares/auth');

// Both creating and joining teams require authentication (any role)
router.post('/', protect, createTeam);
router.post('/join', protect, joinTeam);

module.exports = router;
