const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Get all lists
app.get('/lists', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM lists');
  res.json(rows);
});

// Create a new list
app.post('/lists', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'List name is required' });
  await db.query('INSERT INTO lists (name) VALUES (?)', [name]);
  res.status(201).json({ message: 'List created' });
});

// Get tasks for a list
app.get('/tasks/:listId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE list_id = ?', [req.params.listId]);
  res.json(rows);
});

// Add a task
app.post('/tasks', async (req, res) => {
  const { list_id, description } = req.body;
  if (!list_id || !description) {
    return res.status(400).json({ error: 'List ID and description are required' });
  }
  await db.query('INSERT INTO tasks (list_id, description) VALUES (?, ?)', [list_id, description]);
  res.status(201).json({ message: 'Task added' });
});

// Delete a list and its tasks
app.delete('/lists/:id', async (req, res) => {
  await db.query('DELETE FROM lists WHERE id = ?', [req.params.id]);
  res.json({ message: 'List deleted' });
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
  res.json({ message: 'Task deleted' });
});

// Toggle task completion
app.put('/tasks/:id/toggle', async (req, res) => {
  await db.query(`
    UPDATE tasks 
    SET completed = NOT completed 
    WHERE id = ?
  `, [req.params.id]);
  
  res.json({ message: 'Task toggled' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


