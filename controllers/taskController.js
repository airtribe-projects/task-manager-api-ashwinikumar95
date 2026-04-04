const Task = require('../models/Task');
const uuid = require('uuid');

const createTask = async (req, res) => {
  const { title, description } = req.body;
  if (title == null || description == null) {
    return res.status(400).json({ error: 'title and description are required' });
  }
  const task = new Task({ id: uuid.v4(), title, description, completed: false });
  await task.save();
  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed must be a boolean' });
  }
  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true }
  );
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const removed = await Task.findByIdAndDelete(id);
  if (!removed) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json(removed);
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
