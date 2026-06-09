const express = require('express');
const router = express.Router();
const { getEventRegistrations, createRegistration, syncToSheet } = require('../controllers/registrationController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');
const upload = require('../middlewares/upload');

// GET /api/registrations/:eventId -> Only Core and Head can view data
router.get('/:eventId', protect, authorizeRoles('core', 'head'), getEventRegistrations);

// POST /api/registrations -> Any authenticated user can register (with optional file upload)
router.post('/', protect, upload.single('file'), createRegistration);

// POST /api/registrations/:eventId/sync -> Admin syncs data to Google Sheet (Option B)
router.post('/:eventId/sync', protect, authorizeRoles('core', 'head'), syncToSheet);

module.exports = router;
