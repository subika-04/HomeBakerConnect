import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/DeliveryDashboard.css";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [codes, setCodes] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000); // every 1 sec (as in your original)

    return () => clearInterval(interval); // cleanup
  }, []);

  // ⭐ Fetch Assigned Orders (from your original code)
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://homebakerconnect.onrender.com/delivery/partnerOrders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ⭐ Store delivery code per order
  const handleCodeChange = (orderId, value) => {
    setCodes((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  // ⭐ Confirm Delivery (Validate Code + Mark Delivered)
  const confirmDelivery = async (orderId) => {
    try {
      // Step 1 → Verify delivery code
      await axios.put(
        "https://homebakerconnect.onrender.com/delivery/confirmDelivery",
        {
          orderId,
          deliveryCode: codes[orderId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Step 2 → Mark Delivered (Extra tracking API)
      await markDelivered(orderId);

      alert("Order Delivered ✅");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming delivery");
    }
  };

  // ⭐ Mark Delivered API
  const markDelivered = async (orderId) => {
    try {
      await axios.put(
        `https://homebakerconnect.onrender.com/delivery/markDelivered/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log("Mark Delivered Error:", error);
      throw error;
    }
  };

  // Send location every 10 seconds (new addition)
  useEffect(() => {
    const sendLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await axios.put(
                "https://homebakerconnect.onrender.com/delivery/updateLocation",
                { lat: latitude, lng: longitude },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } catch (error) {
              console.log("Location update error:", error);
            }
          },
          (error) => console.log("Geolocation error:", error)
        );
      }
    };

    sendLocation();
    const locationInterval = setInterval(sendLocation, 3000); // Every 10s
    return () => clearInterval(locationInterval);
  }, [token]);

  return (
    <div className="page">
      <div className="dashboardCard">
        <h2 className="title">🚚 Delivery Dashboard</h2>

        {orders.length === 0 ? (
          <div className="emptyBox">
            <h3>No Orders Assigned</h3>
            <p>Relax... New orders will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="orderCard">
              <div className="orderInfo">
                <p>
                  <strong>Order ID :</strong> {order._id}
                </p>
                <p>
                  <strong>Status :</strong> {order.status}
                </p>
              </div>

              {/* Code Input */}
              <input
                className="input"
                placeholder={`Enter customer code after receiving payment of ₹${order.totalAmount}`}
                value={codes[order._id] || ""}
                onChange={(e) => handleCodeChange(order._id, e.target.value)}
              />

              {/* Confirm Button */}
              <button className="button" onClick={() => confirmDelivery(order._id)}>
                Confirm Delivery
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;