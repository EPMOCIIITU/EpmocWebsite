const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

// GET /api/tasks -> Member, Head, Core
router.get('/', protect, authorizeRoles('member', 'head', 'core'), getTasks);

// POST /api/tasks -> Core
router.post('/', protect, authorizeRoles('core'), createTask);

// PUT /api/tasks/:id/status -> Member, Head, Core
router.put('/:id/status', protect, authorizeRoles('member', 'head', 'core'), updateTaskStatus);

module.exports = router;
