const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const role = req.user.role;
    let filter = {};

    if (role === 'member') {
      filter.assignedTo = req.user._id;
    }
    
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'email')
      .populate('assignedBy', 'email');
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, assignedTo } = req.body;
    
    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and Assignee are required' });
    }

    const task = await Task.create({
      title,
      assignedTo,
      assignedBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'email')
      .populate('assignedBy', 'email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only assignee, or higher roles can update
    if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role === 'member') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = req.body.status || 'COMPLETED';
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus
};
