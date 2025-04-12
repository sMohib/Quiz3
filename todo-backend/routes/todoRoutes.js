const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Schema & Model
const Todo = mongoose.model('Todo', {
  title: String,
  completed: { type: Boolean, default: false },
});

// GET all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST a new todo
router.post('/', async (req, res) => {
  const todo = new Todo({ title: req.body.title });
  await todo.save();
  res.json(todo);
});

// PUT to toggle todo
router.put('/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updated);
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
