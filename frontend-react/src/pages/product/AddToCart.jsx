import axios from "axios";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "../css/AddToCart.css";

const stripePromise = loadStripe("pk_test_51SzrVvCZKsVBoVOdI7cIhh6B2SxIRtFcm7RZRdcsAWc0VAgaVUdg3LtYNLqYtFkx2LxqgX0o79mhqbeTqlHGkQvd00WgYfXS7h");

const AddToCart = () => {

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [bakeryDetails, setBakeryDetails] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const bakerId = cartItems.length > 0 ? cartItems[0].bakerId : null;

  // =============================
  // FETCH BAKERY DETAILS
  // =============================
  useEffect(() => {
    if (!bakerId) return;

    axios
      .get(
        `https://homebakerconnect.onrender.com/product/getBakeryDetails/${bakerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setBakeryDetails(res.data);
      })
      .catch((err) => console.log(err));
  }, [bakerId]);

  // =============================
  // TOTAL AMOUNT
  // =============================
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // =============================
  // PLACE ORDER + STRIPE PAYMENT
  // =============================
  const placeOrder = async () => {

    if (cartItems.length === 0) return alert("Cart is empty");

    try {

      // 1️⃣ Create Order in DB (Payment Pending)
      const orderRes = await axios.post(
        "https://homebakerconnect.onrender.com/product/placeOrder",
        { cart: cartItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderRes.data.orderId;

      // 2️⃣ Create Stripe Checkout Session
      const sessionRes = await axios.post(
        "https://homebakerconnect.onrender.com/payment/createCheckoutSession",
        { orderId }
      );

      const stripe = await stripePromise;

      // 3️⃣ Redirect to Stripe
      await stripe.redirectToCheckout({
        sessionId: sessionRes.data.id,
      });

    } catch (error) {
      console.log(error);
      alert("Payment Failed ❌");
    }
  };

  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    localStorage.removeItem("currentBakerId");
    setCartItems([]);
  };

  return (
    <div className="cartPage">
      <h2>Your Cart</h2>

      {cartItems.length > 0 && (
        <div className="cartFooter">
          <h3>Total Amount: ₹{totalAmount}</h3>

          {/* ✅ Only One Button */}
          <button onClick={placeOrder}>
            Proceed to Payment
          </button>

        </div>
      )}

      <div className="cartHeader">
        <span>Product</span>
        <span>Image</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
      </div>

      {cartItems.length === 0 && (
        <p className="emptyCart">No Products Added Yet</p>
      )}

      {cartItems.map((item) => (
        <div key={item._id} className="cartRow">
          <span>{item.productName}</span>
          <img src={item.productImage} alt="" />
          <span>{item.quantity}</span>
          <span>₹{item.price}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <div className="cartActions">
        <button onClick={() => navigate(-1)}>Add More Products</button>
        <button onClick={clearCart}>Clear Cart</button>
      </div>

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
