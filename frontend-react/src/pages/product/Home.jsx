import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../css/Home.css'

const Home = () => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    axios
      .get("https://homebakerconnect.onrender.com/product/getAllProductsForCustomer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  // Get quantity
  const getQuantity = (productId) => {
    const item = cart.find((c) => c._id === productId);
    return item ? item.quantity : 0;
  };

  // Add / increase quantity
  const addToCart = (product) => {
    const storedBakerId = JSON.parse(localStorage.getItem("currentBakerId"));

    if (cart.length === 0) {
      localStorage.setItem(
        "currentBakerId",
        JSON.stringify(product.bakerId)
      );
    }

    if (storedBakerId && storedBakerId !== product.bakerId) {
      const confirmClear = window.confirm(
        "Your cart contains items from another bakery. Clear cart and add this item?"
      );
      if (!confirmClear) return;

      localStorage.removeItem("cart");
      localStorage.removeItem("currentBakerId");
      localStorage.setItem(
        "currentBakerId",
        JSON.stringify(product.bakerId)
      );
      setCart([]);
    }

    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      let updatedCart;

      if (existing) {
        updatedCart = prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCart((prev) => {
      const updatedCart = prev
        .map((p) =>
          p._id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0);

      if (updatedCart.length === 0) {
        localStorage.removeItem("currentBakerId");
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Quantity UI (reused in normal + overlay)
  const renderQuantityComponent = (product) => {
    const qty = getQuantity(product._id);

    if (qty === 0) {
      return (
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      );
    }

    return (
      <div className="qtyControl">
        <button onClick={() => decreaseQuantity(product._id)}>-</button>
        <span>{qty}</span>
        <button onClick={() => addToCart(product)}>+</button>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      {/* Header */}
<div className="homeHeader">

  {/* LEFT → LOGO */}
  <div className="logoSection">
    <img src="/logo2.png" alt="BakeCloud Logo" />
    <h3>BakeCloud</h3>
  </div>

  {/* CENTER → SEARCH */}
  <div className="searchSection">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* RIGHT → NAV BUTTONS */}
  <div className="navButtons">
    <Link to="/cart">
      <button className="cartButton">View Cart</button>
    </Link>

    <Link to="/userOrder">
      <button className="orderButton">Your Orders</button>
    </Link>
  </div>

</div>


      {/* Products */}
      {data.map((item) => (
        <div key={item.baker._id}>
          <h1>{item.baker.bakeryBrandName}</h1>

          <div className="userPageProduct">
            {item.products
              .filter((product) =>
                product.productName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <div key={product._id} className="userProduct">
                  <h4>{product.productName}</h4>
                  <p>₹{product.price}</p>
                  <img src={product.productImage} alt="" />

                  {/* Normal view */}
                  {renderQuantityComponent(product)}

                  {/* Overlay view */}
                  <div className="overlay">
                    {renderQuantityComponent(product)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
