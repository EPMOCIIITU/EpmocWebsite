const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

// POST /api/events -> Only Core and Head can create events
router.post('/', protect, authorizeRoles('core', 'head'), createEvent);

// GET /api/events -> Public
router.get('/', getEvents);

module.exports = router;
