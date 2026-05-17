const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
// The VIP Guest List for your API
const allowedOrigins = [
    'http://localhost:5173', // Keep localhost so you can still test on your computer
    'https://my-practice-erp.vercel.app' // REPLACE THIS with your actual Vercel URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json()); // Allows our server to understand JSON data

// 1. Connect to the Database (this automatically creates a file called erp.db)
const db = new sqlite3.Database('./erp.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// 2. Create our Tables (Entities from Phase 2)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER, productId INTEGER, quantity INTEGER)`);
});

// 3. Create an API Endpoint to GET all products
app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) return res.status(500).json();
        res.json(rows);
    });
});

// 3.5 Create an API Endpoint to POST (add) a new product
app.post('/api/products', (req, res) => {
    const { name, price, stock } = req.body; // Extract data from the incoming request

    // Insert the new data into our SQLite database
    db.run(
        `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`,
        [name, price, stock],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            // Send back the newly created product (including its new auto-generated ID)
            res.json({ id: this.lastID, name, price, stock });
        }
    );
});

// 3.7 Create an API Endpoint to DELETE a product
// The ":id" part is a URL variable. If we request /api/products/5, req.params.id will be 5.
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM products WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

// --- CRM MODULE (CUSTOMERS) ---

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
app.listen(3000, () => {
    console.log('Backend server is running on http://localhost:3000');
});