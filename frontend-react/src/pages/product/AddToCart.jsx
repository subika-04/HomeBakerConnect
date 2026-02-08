import axios from "axios";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddToCart.css";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [bakeryDetails, setBakeryDetails] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Get bakerId from first cart item
  const bakerId = cartItems.length > 0 ? cartItems[0].bakerId : null;

  // Fetch bakery details
  useEffect(() => {
    if (!bakerId) return;

    axios
      .get(`http://localhost:9000/product/getBakeryDetails/${bakerId}`,{
          headers: { Authorization: `Bearer ${token}` },
        })
      .then((res) => {
        setBakeryDetails(res.data);
      })
      .catch((err) => console.log(err));
  }, [bakerId]);

  // Total Amount
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Place Order
  const placeOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    try {
      const response = await axios.post(
        "http://localhost:9000/product/placeOrder",
        { cart: cartItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      localStorage.removeItem("cart");
      localStorage.removeItem("currentBakerId");
      navigate(-1);
    } catch (error) {
      alert("Order Failed");
    }
  };

  // Clear Cart
  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    localStorage.removeItem("currentBakerId");
    setCartItems([]);
  };

  return (
    <div className="cartPage">
      <h2>Your Cart</h2>

      {/* Footer Total */}
      {cartItems.length > 0 && (
        <div className="cartFooter">
          <h3>Total Amount: ₹{totalAmount}</h3>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}

      {/* Column Headers */}
      <div className="cartHeader">
        <span>Product</span>
        <span>Image</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 && (
        <p className="emptyCart">No Products Added Yet</p>
      )}

      {/* Cart Rows */}
      {cartItems.map((item) => (
        <div key={item._id} className="cartRow">
          <span>{item.productName}</span>
          <img src={item.productImage} alt="" />
          <span>{item.quantity}</span>
          <span>₹{item.price}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="cartActions">
        <button onClick={() => navigate(-1)}>Add More Products</button>
        <button onClick={clearCart}>Clear Cart</button>
      </div>

      {/* ⭐ Bakery Footer */}
      {bakeryDetails && (
        <div className="bakeryFooter">
          <h3>{bakeryDetails.bakeryBrandName}</h3>
          <p>{bakeryDetails.kitchenAddress}</p>

          <p>
            📞{" "}
            <a href={`tel:${bakeryDetails.phoneNo}`}>
              {bakeryDetails.phoneNo}
            </a>
          </p>

          <button
            onClick={() =>
              (window.location.href = `mailto:${bakeryDetails.email}`)
            }
          >
            Send Email
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
