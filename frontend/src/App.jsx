import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  // State to hold the values typed into our form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  // Vite automatically knows when it is in 'production' vs 'development'
  const API_URL = import.meta.env.PROD
    ? 'https://my-practice-erp.onrender.com/api/products' // Your REAL Render URL
    : 'http://localhost:3000/api/products';

  // Fetch initial data (GET request)
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // Function to handle adding a new product (POST request)
  const handleAddProduct = (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you click submit

    const newProduct = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      stock: 10 // Hardcoding stock to 10 for simplicity right now
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct) // Turn our JavaScript object into JSON text
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new product to our existing list on the screen
        setProducts([...products, data]);
        // Clear the form fields
        setNewProductName('');
        setNewProductPrice('');
      })
      .catch((error) => console.error("Error saving:", error));
  };

  const handleDeleteProduct = (id) => {
    // 1. Tell the backend to delete it
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // 2. Remove it from our React screen without refreshing the page
        setProducts(products.filter(product => product.id !== id));
      })
      .catch((error) => console.error("Error deleting:", error));
  };

  return (
    <div className="erp-container">
      <header>
        <h1>My Practice ERP</h1>
        <p>Connecting CRM, Inventory, and Sales</p>
      </header>

      <main className="modules-grid">
        <section className="module-card">
          <h2>👥 Customers (CRM)</h2>
          <p>Customer data will go here.</p>
        </section>

        <section className="module-card">
          <h2>📦 Products (Inventory)</h2>

          {/* The new form to add products */}
          <form onSubmit={handleAddProduct} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              required
            />
            <button type="submit">Add Product</button>
          </form>

          {products.length === 0 ? (
            <p>No products in the database yet!</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <span>{product.name} - ${product.price} (Stock: {product.stock})</span>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="module-card">
          <h2>🛒 Orders (Sales)</h2>
          <p>Sales data will go here.</p>
        </section>
      </main>
    </div>
  );
}

export default App;