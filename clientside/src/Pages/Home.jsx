import React, { useState } from "react";
import Nav from "../components/Nav";
import "./Home.css";
import { MapPin, Phone, Mail, Clock, Heart } from "lucide-react";
import Footer from "../components/Footer";

const categories = [
  { name: "Special Offers", products: 2, color: "pink", icon: "🎉" },
  { name: "Diapers", products: 4, color: "blue", icon: "👶" },
  { name: "Baby Wipes", products: 0, color: "green", icon: "🧻" },
  { name: "Baby Formula", products: 0, color: "purple", icon: "🍼" },
  { name: "Baby Clothing", products: 1, color: "orange", icon: "👕" },
  { name: "Baby Toys", products: 1, color: "yellow", icon: "🧸" },
  { name: "Baby Care", products: 1, color: "violet", icon: "🧴" },
  { name: "Feeding", products: 0, color: "pink", icon: "🥄" },
  { name: "Other", products: 0, color: "gray", icon: "📦" },
];

// Sample products for different categories
const diaperProducts = [
  {
    id: 1,
    name: "Baby Diapers Size 3",
    size: "3 • 6 diapers",
    stock: "Stock: 60",
    price: "80 QR",
    image: "/api/placeholder/120/150"
  },
  {
    id: 2,
    name: "Newborn Diaper Set",
    size: "NB • 75pcs",
    stock: "Stock: 1",
    price: "73 QR",
    originalPrice: "85 QR",
    offer: "OFFER",
    image: "/api/placeholder/120/150"
  },
  {
    id: 3,
    name: "Baby Diapers Size 4",
    size: "4 • 52pcs",
    stock: "Stock: 45",
    price: "82 QR",
    image: "/api/placeholder/120/150"
  },
  {
    id: 4,
    name: "Baby Diapers Size 5",
    size: "5 XL • 46pcs",
    stock: "Stock: 35",
    price: "85 QR",
    image: "/api/placeholder/120/150"
  }
];

const specialOfferProducts = [
  {
    id: 1,
    name: "PEN",
    size: "5 • 25",
    stock: "Stock: 100",
    price: "22 QR",
    originalPrice: "25 QR",
    offer: "OFFER",
    image: "/api/placeholder/120/150"
  },
  {
    id: 2,
    name: "Newborn Diaper Set",
    size: "NB • 75pcs",
    stock: "Stock: 1",
    price: "73 QR",
    originalPrice: "85 QR",
    offer: "OFFER",
    image: "/api/placeholder/120/150"
  }
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Special Offers");

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const getCurrentProducts = () => {
    switch (selectedCategory) {
      case "Special Offers":
        // return specialOfferProducts;
        return diaperProducts;
      case "Diapers":
        return diaperProducts;
      default:
        return diaperProducts;
    }
  };

  const getSectionDescription = () => {
    switch (selectedCategory) {
      case "Special Offers":
        return "Don't miss out on these amazing deals and special offers on premium baby products.";
      case "Diapers":
        return "Browse our collection of diapers for your little ones.";
      case "Baby Wipes":
          return "Browse our collection of Baby Wipes for your little ones.";
      case "Baby Formula":
          return "Browse our collection of Baby Formula for your little ones.";
      case "Baby Clothing":
          return "Browse our collection of Baby Clothing for your little ones.";
      case "Baby Toys":
          return "Browse our collection of Baby Toys for your little ones.";
      case "Baby Care":
          return "Browse our collection of Baby Care for your little ones.";
      case "Feeding":
          return "Browse our collection of Feeding for your little ones.";
      case "Other":
          return "Browse our collection of Other for your little ones.";
      default:
        return "Browse our collection of diapers for your little ones.";
    }
  };

  return (
    <>
      <Nav />
      
      {/* Scrolling Banner Section */}
      <section className="scrolling-banner">
        <div className="banner-container">
          <div className="banner-track">
            {/* Create enough duplicates for seamless infinite scroll */}
            {[...Array(4)].map((_, setIndex) => 
              diaperProducts.map((product) => (
                <div key={`${setIndex}-${product.id}`} className="banner-item">
                  <div className="product-card">
                    <img src={product.image} alt={product.name} />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      {product.size && <span className="size">Size {product.size}</span>}
                      {product.weight && <span className="weight">{product.weight}</span>}
                      {product.count && <span className="count">{product.count}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="features">
        {/* Heading */}
        <div className="features-header">
          <h2>Premium Baby Diapers</h2>
          <p>
            Discover our collection of ultra-soft, super-absorbent diapers
            designed to keep your baby comfortable and dry all day long.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon blue">⭐</div>
            <h3>4.9★</h3>
            <p>Customer Rating</p>
          </div>

          <div className="feature-card">
            <div className="icon pink">👨‍👩‍👧</div>
            <h3>50K+</h3>
            <p>Happy Parents</p>
          </div>

          <div className="feature-card">
            <div className="icon green">🛒</div>
            <h3>24h</h3>
            <p>Fast Delivery</p>
          </div>

          <div className="feature-card">
            <div className="icon orange">✅</div>
            <h3>100%</h3>
            <p>Quality Guarantee</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2 className="categories-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div 
              className={`category-card ${selectedCategory === cat.name ? 'selected' : ''}`} 
              key={i}
              onClick={() => handleCategoryClick(cat.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`icon ${cat.color}`}>{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.products} products</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Products Section */}
      <section className="products-section">
        <div className="products-header">
          <h2>{selectedCategory}</h2>
          <p>{getSectionDescription()}</p>
        </div>
        
        <div className="products-grid">
          {getCurrentProducts().map((product) => (
            <div key={product.id} className="product-card-main">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.offer && (
                  <span className="offer-badge">{product.offer}</span>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-size">{product.size}</p>
                <p className="product-stock">{product.stock}</p>
                <div className="product-price">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                </div>
                <button className="add-to-cart-btn">
                  <span>+</span> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer/>
    </>
  );
};

export default Home;
