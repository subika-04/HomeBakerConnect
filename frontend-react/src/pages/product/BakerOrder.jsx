import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/BakerOrder.css";
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import "leaflet-routing-machine";


const BakerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null); // New: For modal
  const [partnerLocation, setPartnerLocation] = useState(null); // New: For location
  const token = localStorage.getItem("token");

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://homebakerconnect.onrender.com/product/getBakerOrder",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  // ✅ Auto refresh every 5 seconds (SAFE)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Normal Status Update
  const updateStatus = async (orderId, statusUpdate) => {
    try {
      await axios.put(
        "https://homebakerconnect.onrender.com/product/updateOrderStatus",
        { orderId, status: statusUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrders();
    } catch {
      alert("Failed to update status");
    }
  };

  // ✅ Assign Delivery Partner
  const outForDelivery = async (orderId) => {
    try {
      await axios.put(
        `https://homebakerconnect.onrender.com/delivery/outForDelivery/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Delivery Partner Assigned 🚚");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Error assigning partner");
    }
  };

  // New: Track order function
  const trackOrder = async (orderId) => {
    console.log("orderId : "+orderId)
    setTrackingOrder(orderId);
    fetchLocation(orderId);
    const locationInterval = setInterval(() => fetchLocation(orderId), 5000); // Update every 5s
    setTimeout(() => clearInterval(locationInterval), 300000); // Stop after 5 min for demo
  };

  // New: Fetch location
  const fetchLocation = async (orderId) => {
  console.log("Fetching location for:", orderId); // add this

  try {
    const res = await axios.get(
      `https://homebakerconnect.onrender.com/delivery/getLocation/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPartnerLocation(res.data.location);
  } catch (error) {
    console.log("Location fetch error:", error.response?.data);
    setPartnerLocation(null);
  }
};


  // New: Close tracking modal
  const closeTracking = () => {
    setTrackingOrder(null);
    setPartnerLocation(null);
  };

  return (
    <div className="baker-orders-page">
      <h2>Received Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders yet 🍰</h3>
          <p>Relax… new orders will appear here.</p>
        </div>
      ) : (
        orders.map((order) => (
        <div className="baker-order-card" key={order._id}>
            {/* Items */}
            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item._id}>
                  <img src={item.productImage} alt={item.name} />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
          <div className="order-summary">
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
            </div>

            {/* Status Buttons */}
            <div className="status-actions">
              <button
                disabled={order.status !== "Placed"}
                onClick={() => updateStatus(order._id, "Preparing")}
              >
                Preparing
              </button>

              <button
                disabled={order.status !== "Preparing"}
                onClick={() =>
                  updateStatus(order._id, "Ready for Delivery")
                }
              >
                Ready
              </button>

              <button
                disabled={order.status !== "Ready for Delivery"}
                onClick={() => outForDelivery(order._id)}
              >
                Out for Delivery
              </button>

              <button
                className={`delivered-btn ${
                  order.status === "Delivered" ? "active" : ""
                }`}
                disabled
              >
                Delivered
              </button>
            </div>
            <div className="deliveryCodeBaker">
            {order.deliveryCode && (
                <p className="delivery-code">
                  Delivery Code : {order.deliveryCode}
                </p>
              )}
        
            
            </div>
          </div>
        ))
      )}

      {/* New: Tracking Modal */}
      {trackingOrder && (
        <div className="modal">
          <div className="modal-content">
            <h4>Tracking Delivery</h4>
            {partnerLocation ? (
              <MapContainer
                center={[partnerLocation.lat, partnerLocation.lng]}
                zoom={15}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> {/* Updated to green topographic map */}
                <Marker position={[partnerLocation.lat, partnerLocation.lng]}>
                  <Popup>Delivery Partner Location</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Location not available yet.</p>
            )}
            <button onClick={closeTracking}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BakerOrder;