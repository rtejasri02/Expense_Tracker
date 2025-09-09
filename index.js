// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let pool;
(async function initDB(){
  pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'expense_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('MySQL pool created');
})();

// CRUD endpoints

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY date_of_expense DESC, id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add expense
app.post('/api/expenses', async (req, res) => {
  const { expense_name, amount, category, date_of_expense } = req.body;
  if (!expense_name || !amount || !category || !date_of_expense) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO expenses (expense_name, amount, category, date_of_expense) VALUES (?, ?, ?, ?)',
      [expense_name, amount, category, date_of_expense]
    );
    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
  const id = req.params.id;
  const { expense_name, amount, category, date_of_expense } = req.body;
  try {
    await pool.query(
      'UPDATE expenses SET expense_name=?, amount=?, category=?, date_of_expense=? WHERE id=?',
      [expense_name, amount, category, date_of_expense, id]
    );
    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));