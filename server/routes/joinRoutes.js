const express = require('express');
const router = express.Router();
const { submitJoinRequest, getJoinRequests } = require('../controllers/joinController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

// Protected route to submit a join request (requires login)
router.post('/', protect, submitJoinRequest);

// Protected route to view all join requests (only for core team)
router.get('/', protect, authorizeRoles('core'), getJoinRequests);

module.exports = router;
