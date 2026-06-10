const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

router.get('/', protect, authorizeRoles('head', 'core'), getUsers);
router.put('/:id/role', protect, authorizeRoles('head', 'core'), updateUserRole);

module.exports = router;
