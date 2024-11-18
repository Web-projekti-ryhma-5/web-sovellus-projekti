import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const newUser = await pool.query(
      'INSERT INTO users (user_email, user_password) VALUES($1, $2) RETURNING *',
      [user_email, user_password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const allOrders = await pool.query(`
      SELECT o.*, u.user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.user_id
    `);
    res.json(allOrders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { user_id } = req.body;
    const newOrder = await pool.query(
      'INSERT INTO orders (user_id) VALUES($1) RETURNING *',
      [user_id]
    );
    res.json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Items endpoints
app.get('/api/items', async (req, res) => {
  try {
    const allItems = await pool.query('SELECT * FROM items');
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { item_name, item_info } = req.body;
    const newItem = await pool.query(
      'INSERT INTO items (item_name, item_info) VALUES($1, $2) RETURNING *',
      [item_name, item_info]
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 