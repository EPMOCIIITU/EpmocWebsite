const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

// POST /api/events -> Only Core and Head can create events
router.post('/', protect, authorizeRoles('core', 'head'), createEvent);

// GET endpoints will be added in Phase 6
// router.get('/', getEvents);

module.exports = router;
