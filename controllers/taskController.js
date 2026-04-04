const Task = require('../models/Task');
const uuid = require('uuid');

const PRIORITIES = ['low', 'medium', 'high'];

function isValidPriority(p) {
  return PRIORITIES.includes(p);
}

function sortByCreatedAt(list, order) {
  const dir = order === 'desc' ? -1 : 1;
  return [...list].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return (ta - tb) * dir;
  });
}

const createTask = async (req, res) => {
  const { title, description, priority: bodyPriority } = req.body;
  if (title == null || description == null) {
    return res.status(400).json({ error: 'title and description are required' });
  }
  const priority = bodyPriority ?? 'medium';
  if (!isValidPriority(priority)) {
    return res.status(400).json({ error: 'priority must be low, medium, or high' });
  }
  const task = new Task({
    id: uuid.v4(),
    title,
    description,
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
  });
  await task.save();
  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  let list = await Task.find();
  const { completed, order } = req.query;

  if (completed !== undefined) {
    if (completed !== 'true' && completed !== 'false') {
      return res
        .status(400)
        .json({ error: 'completed query must be true or false' });
    }
    const want = completed === 'true';
    list = list.filter((t) => t.completed === want);
  }

  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    return res.status(400).json({ error: 'order must be asc or desc' });
  }

  list = sortByCreatedAt(list, order);
  res.json(list);
};

const getTasksByPriority = async (req, res) => {
  const { level } = req.params;
  if (!isValidPriority(level)) {
    return res.status(400).json({ error: 'priority must be low, medium, or high' });
  }
  let list = (await Task.find()).filter((t) => t.priority === level);
  const { order } = req.query;
  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    return res.status(400).json({ error: 'order must be asc or desc' });
  }
  list = sortByCreatedAt(list, order);
  res.json(list);
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
  const { title, description, completed, priority } = req.body;
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed must be a boolean' });
  }
  if (priority !== undefined && !isValidPriority(priority)) {
    return res.status(400).json({ error: 'priority must be low, medium, or high' });
  }
  const patch = {};
  if (title !== undefined) patch.title = title;
  if (description !== undefined) patch.description = description;
  if (completed !== undefined) patch.completed = completed;
  if (priority !== undefined) patch.priority = priority;
  const task = await Task.findByIdAndUpdate(id, patch, { new: true });
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
  getTasksByPriority,
  getTaskById,
  updateTask,
  deleteTask,
};
