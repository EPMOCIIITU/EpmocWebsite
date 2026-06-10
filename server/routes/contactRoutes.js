const express = require('express');
const router = express.Router();
const { submitContactMessage, getMessages, markMessageRead } = require('../controllers/contactController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

// Public route to submit a message
router.post('/', submitContactMessage);

// Protected routes to view and manage messages (Core, Head)
router.get('/', protect, authorizeRoles('core', 'head'), getMessages);
router.put('/:id/read', protect, authorizeRoles('core', 'head'), markMessageRead);

module.exports = router;
