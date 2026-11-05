"use client";

import { useMemo, useState } from "react";

const products = [
  { id: 1, name: "CloudRunner Sneakers", category: "Footwear", price: 129, icon: "👟", accent: "#dff4ec" },
  { id: 2, name: "Nimbus Headphones", category: "Audio", price: 189, icon: "🎧", accent: "#eee9ff" },
  { id: 3, name: "Orbit Smart Watch", category: "Wearables", price: 249, icon: "⌚", accent: "#ffe9d8" },
  { id: 4, name: "Vertex Backpack", category: "Accessories", price: 89, icon: "🎒", accent: "#dfeeff" },
  { id: 5, name: "Aero Desk Lamp", category: "Home", price: 119, icon: "💡", accent: "#fff0bf" },
  { id: 6, name: "Pulse Speaker", category: "Audio", price: 159, icon: "🔊", accent: "#ffdede" },
];

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()),
  );
  const cartItems = products.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] }));
  const cartCount = useMemo(() => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0), [cart]);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: (typeof products)[number]) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setNotice(`${product.name} added to cart`);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) => {
      const quantity = (current[id] ?? 0) + amount;
      const next = { ...current }; if (quantity <= 0) delete next[id]; else next[id] = quantity; return next;
    });
  };

  const placeOrder = async () => {
    if (!cartItems.length || !email.trim()) { setNotice("Add items and enter your email"); return; }
    setPlacingOrder(true);
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerEmail: email, items: cartItems.map(({ id, price, quantity }) => ({ id, price, quantity })) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Order failed");
      setCart({}); setCartOpen(false); setNotice(`Order ${result.orderId} placed successfully`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Order failed"); }
    finally { setPlacingOrder(false); }
  };

  return (
    <main>
      <nav className="nav">
        <div className="brand"><span className="brand-mark">N</span><span>NOVA</span></div>
        <div className="nav-links"><a href="#new">New arrivals</a><a href="#shop">Shop</a><a href="#about">About</a></div>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Search">⌕</button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Shopping cart">Bag <span>{cartCount}</span></button>
        </div>
      </nav>

      <section className="hero" id="new">
        <div className="hero-copy">
          <p className="eyebrow">NEW COLLECTION · 2026</p>
          <h1>Designed for<br /><em>everyday motion.</em></h1>
          <p className="hero-text">Considered essentials for work, travel, and everything between.</p>
          <a className="primary-button" href="#shop">Explore collection <span>→</span></a>
        </div>
        <div className="hero-visual" aria-label="Featured collection">
          <div className="sun"></div>
          <div className="hero-card"><span>NEW</span><div className="sneaker">👟</div></div>
          <div className="floating-note"><span>01</span><strong>CloudRunner</strong><small>$129</small></div>
        </div>
      </section>

      <section className="products-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">THE EDIT</p><h2>Popular essentials</h2></div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" />
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image" style={{ backgroundColor: product.accent }}>
                <span className="product-category">{product.category}</span>
                <span className="product-icon" role="img" aria-label={product.name}>{product.icon}</span>
                <button onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>+</button>
              </div>
              <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><strong>${product.price}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise" id="about"><span>FREE DELIVERY OVER $100</span><span>30-DAY RETURNS</span><span>SECURE CHECKOUT</span></section>
      {cartOpen && <><button className="overlay" onClick={() => setCartOpen(false)} aria-label="Close cart"></button><aside className="cart-drawer"><div className="cart-header"><h2>Your bag</h2><button onClick={() => setCartOpen(false)}>×</button></div><div className="cart-items">{cartItems.length ? cartItems.map((item) => <div className="cart-item" key={item.id}><span style={{ background: item.accent }}>{item.icon}</span><div><strong>{item.name}</strong><small>${item.price}</small><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}>+</button></div></div></div>) : <p className="empty-cart">Your bag is empty.</p>}</div><div className="checkout"><div><span>Total</span><strong>${total}</strong></div><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email for order confirmation" /><button onClick={placeOrder} disabled={placingOrder}>{placingOrder ? "Placing order…" : "Place order"}</button></div></aside></>}
      {notice && <div className="toast" role="status">✓ {notice}</div>}
    </main>
  );
}
