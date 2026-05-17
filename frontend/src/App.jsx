import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  // State to hold the values typed into our form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const [customers, setCustomers] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  // Vite automatically knows when it is in 'production' vs 'development'
  const BASE_URL = import.meta.env.PROD
    ? 'https://my-practice-erp.onrender.com/api' // Replace with your actual Render URL
    : 'http://localhost:3000/api';

  // Fetch initial data (GET request)
  useEffect(() => {
    // Fetch Products
    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));

    // Fetch Customers
    fetch(`${BASE_URL}/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  // Function to handle adding a new product (POST request)
  const handleAddProduct = (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you click submit

    const newProduct = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      stock: 10 // Hardcoding stock to 10 for simplicity right now
    };

    fetch(`${BASE_URL}/products`, {
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
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // 2. Remove it from our React screen without refreshing the page
        setProducts(products.filter(product => product.id !== id));
      })
      .catch((error) => console.error("Error deleting:", error));
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const newCustomer = { name: newCustomerName, email: newCustomerEmail };

    fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    })
      .then(res => res.json())
      .then(data => {
        setCustomers([...customers, data]);
        setNewCustomerName('');
        setNewCustomerEmail('');
      });
  };

  const handleDeleteCustomer = (id) => {
    fetch(`${BASE_URL}/customers/${id}`, { method: 'DELETE' })
      .then(() => setCustomers(customers.filter(c => c.id !== id)));
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
          <form onSubmit={handleAddCustomer} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Customer Name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newCustomerEmail}
              onChange={(e) => setNewCustomerEmail(e.target.value)}
              required
            />
            <button type="submit">Add Customer</button>
          </form>

          {customers.length === 0 ? (
            <p>No customers yet!</p>
          ) : (
            <ul>
              {customers.map((customer) => (
                <li key={customer.id}>
                  <span>{customer.name} ({customer.email})</span>
                  <button className="delete-btn" onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
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