const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// CORS Configuration (The VIP Guest List)
const allowedOrigins = [
    'http://localhost:5173',
    'https://my-practice-erp.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json()); // Allows our server to understand JSON data

// 1. Connect to the Database
const db = new sqlite3.Database('./erp.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// 2. Create our Tables (Entities)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER, productId INTEGER, quantity INTEGER)`);
});

// ==========================================
// --- INVENTORY MODULE (PRODUCTS) ---
// ==========================================

// GET all products
app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST a new product
app.post('/api/products', (req, res) => {
    const { name, price, stock } = req.body;
    db.run(
        `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`,
        [name, price, stock],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, price, stock });
        }
    );
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM products WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

// ==========================================
// --- CRM MODULE (CUSTOMERS) ---
// ==========================================

// GET all customers
app.get('/api/customers', (req, res) => {
    db.all(`SELECT * FROM customers`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST a new customer
app.post('/api/customers', (req, res) => {
    const { name, email } = req.body;
    db.run(
        `INSERT INTO customers (name, email) VALUES (?, ?)`,
        [name, email],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, email });
        }
    );
});

// DELETE a customer
app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM customers WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer deleted successfully" });
    });
});

// 4. Start the server
// process.env.PORT allows Render to assign its own port, defaulting to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});