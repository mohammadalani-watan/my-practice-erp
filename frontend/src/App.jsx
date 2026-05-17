import React, { useState, useEffect } from 'react';
import './App.css';

// Set the base URL dynamically: Render for production, localhost for development
const BASE_URL = import.meta.env.PROD
  ? 'https://my-practice-erp.onrender.com/api'
  : 'http://localhost:3000/api';

function App() {
  // ==========================================
  // --- STATE VARIABLES ---
  // ==========================================

  // Products State
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  // Customers State
  const [customers, setCustomers] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  // ==========================================
  // --- INITIAL DATA FETCH (ON PAGE LOAD) ---
  // ==========================================
  useEffect(() => {
    // Fetch Products
    fetch(`${BASE_URL}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));

    // Fetch Customers
    fetch(`${BASE_URL}/customers`)
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  // ==========================================
  // --- PRODUCT HANDLERS ---
  // ==========================================
  const handleAddProduct = (e) => {
    e.preventDefault();

    const newProduct = {
      name: newProductName,
      price: parseFloat(newProductPrice),
      stock: 10 // Hardcoded for practice
    };

    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts([...products, data]);
        setNewProductName('');
        setNewProductPrice('');
      })
      .catch((error) => console.error("Error saving product:", error));
  };

  const handleDeleteProduct = (id) => {
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  // ==========================================
  // --- CUSTOMER HANDLERS ---
  // ==========================================
  const handleAddCustomer = (e) => {
    e.preventDefault();

    const newCustomer = {
      name: newCustomerName,
      email: newCustomerEmail
    };

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
      })
      .catch((error) => console.error("Error saving customer:", error));
  };

  const handleDeleteCustomer = (id) => {
    fetch(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setCustomers(customers.filter(c => c.id !== id));
      })
      .catch((error) => console.error("Error deleting customer:", error));
  };

  // ==========================================
  // --- RENDER USER INTERFACE ---
  // ==========================================
  return (
    <div className="erp-container">
      <header>
        <h1>My Practice ERP</h1>
        <p>Connecting CRM, Inventory, and Sales</p>
      </header>

      <main className="modules-grid">

        {/* MODULE 1: CRM (Customers) */}
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

        {/* MODULE 2: Inventory (Products) */}
        <section className="module-card">
          <h2>📦 Products (Inventory)</h2>

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

        {/* MODULE 3: Orders (Sales) - Ready for your next challenge! */}
        <section className="module-card">
          <h2>🛒 Orders (Sales)</h2>
          <p>Sales data will go here.</p>
        </section>

      </main>
    </div>
  );
}

export default App;