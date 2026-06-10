const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'head') {
      filter.role = { $in: ['participant', 'member'] };
    }
    
    const users = await User.find(filter).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetUser = await User.findById(req.params.id);
    
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (req.user.role === 'head') {
      if (['head', 'core'].includes(targetUser.role) || ['head', 'core'].includes(role)) {
        return res.status(403).json({ message: 'Not authorized for this role assignment' });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json(targetUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

const updateUserDepartments = async (req, res) => {
  try {
    const { memberDepartments } = req.body;
    const targetUser = await User.findById(req.params.id);
    
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Only allow setting departments for members or above
    if (targetUser.role === 'participant') {
      return res.status(400).json({ message: 'Cannot assign working departments to a participant. Upgrade role first.' });
    }

    targetUser.memberDepartments = memberDepartments;
    await targetUser.save();

    res.status(200).json(targetUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user departments', error: error.message });
  }
};

module.exports = { getUsers, updateUserRole, updateUserDepartments };
