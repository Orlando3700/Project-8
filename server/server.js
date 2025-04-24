const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Get all lists
// Responds to a GET request to /lists.
// Queries all rows from the lists table and returns them as JSON.
app.get('/lists', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM lists');
  res.json(rows);
});

// Create a new list
// Handles POST requests to create a new list.
// Checks that a name was provided.
// Inserts a new list into the database.
// Responds with success message.
app.post('/lists', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'List name is required' });
  await db.query('INSERT INTO lists (name) VALUES (?)', [name]);
  res.status(201).json({ message: 'List created' });
});

// Get tasks for a list
// Fetches all tasks that belong to a specific list (using listId from URL).
// Returns tasks as JSON.
app.get('/tasks/:listId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE list_id = ?', [req.params.listId]);
  res.json(rows);
});

// Add a task
// Adds a new task to a list.
// Requires both list_id and description.
// Inserts task into database and returns a success response.
app.post('/tasks', async (req, res) => {
  const { list_id, description } = req.body;
  if (!list_id || !description) {
    return res.status(400).json({ error: 'List ID and description are required' });
  }
  await db.query('INSERT INTO tasks (list_id, description) VALUES (?, ?)', [list_id, description]);
  res.status(201).json({ message: 'Task added' });
});

// Delete a list and its tasks
// Deletes a list using its ID from the URL
app.delete('/lists/:id', async (req, res) => {
  await db.query('DELETE FROM lists WHERE id = ?', [req.params.id]);
  res.json({ message: 'List deleted' });
});

// Delete a task
// Deletes a task based on its ID.
app.delete('/tasks/:id', async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
  res.json({ message: 'Task deleted' });
});

// Toggle task completion
// Toggles a task’s completed field (true → false or false → true).
// Responds with a simple success message.
app.put('/tasks/:id/toggle', async (req, res) => {
  await db.query(`
    UPDATE tasks 
    SET completed = NOT completed 
    WHERE id = ?
  `, [req.params.id]);
  
  res.json({ message: 'Task toggled' });
});

// Start the server
// Starts the server on port 3000.
// Logs the server URL in the console.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


