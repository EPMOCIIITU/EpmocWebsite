const express = require('express');
const router = express.Router();
const { getEventRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

// GET /api/registrations/:eventId -> Only Core and Head can view data
router.get('/:eventId', protect, authorizeRoles('core', 'head'), getEventRegistrations);

// POST endpoints will be added in Phase 7
// router.post('/', createRegistration);

module.exports = router;
