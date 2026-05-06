const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
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

// 4. Start the server
app.listen(3000, () => {
    console.log('Backend server is running on http://localhost:3000');
});