import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/DeliveryDashboard.css";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [codes, setCodes] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
  try {
    const res = await axios.get(
      "https://homebakerconnect.onrender.com/delivery/partnerOrders",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("API Response:", res.data);  // Debug the full response
    setOrders(res.data.orders || []);
  } catch (error) {
    console.error("Fetch error:", error.response?.data || error.message);
  }
};

  const handleCodeChange = (orderId, value) => {
    setCodes((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const confirmDelivery = async (orderId) => {
    try {
      const res=await axios.put(
        "https://homebakerconnect.onrender.com/delivery/confirmDelivery",
        {
          orderId,
          deliveryCode: codes[orderId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message+"✅");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming delivery");
    }
  };

  // Send live location
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
    const locationInterval = setInterval(sendLocation, 3000);
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
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>

                {/* ✅ DELIVERY ADDRESS */}
                <div className="addressBox">
  <p><strong>Customer:</strong> {order.userId?.fullName || "N/A"}</p>
  <p>{order.userId?.houseFlatNo || "N/A"}, {order.userId?.areaStreet || "N/A"}</p>
  <p>{order.userId?.city || "N/A"} - {order.userId?.pincode || "N/A"}</p>
  <p><strong>Phone:</strong> {order.userId?.phoneNo || "N/A"}</p>
</div>
              </div>

              <input
                className="input"
                placeholder={`Enter customer code after receiving payment of ₹${order.totalAmount}`}
                value={codes[order._id] || ""}
                onChange={(e) =>
                  handleCodeChange(order._id, e.target.value)
                }
              />

              <button
                className="button"
                onClick={() => confirmDelivery(order._id)}
              >
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
