import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/UserOrder.css";
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UserOrder = () => {
  const [orders, setOrder] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null); // New: For modal
  const [partnerLocation, setPartnerLocation] = useState(null); // New: For location
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://homebakerconnect.onrender.com/product/getUserOrder",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data.orders);
        setOrder(res.data.orders);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 1000); // every 5 sec

    return () => clearInterval(interval); // cleanup
  }, []);

  // New: Track order function
  const trackOrder = async (orderId) => {
    setTrackingOrder(orderId);
    fetchLocation(orderId);
    const locationInterval = setInterval(() => fetchLocation(orderId), 5000); // Update every 5s
    setTimeout(() => clearInterval(locationInterval), 300000); // Stop after 5 min for demo
  };

  // New: Fetch location
  const fetchLocation = async (orderId) => {
    try {
      const res = await axios.get(`https://homebakerconnect.onrender.com/delivery/getLocation/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartnerLocation(res.data.location);
    } catch (error) {
      console.log("Location fetch error:", error.message);
      setPartnerLocation(null);
    }
  };

  // New: Close tracking modal
  const closeTracking = () => {
    setTrackingOrder(null);
    setPartnerLocation(null);
  };

  return (
    <div className="orders-container">
      <h3>Your Orders</h3>

      {orders.length === 0 ? (
        <h3 className="no-orders">No orders yet 🍰</h3>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            {/* Items */}
            {order.items.map((item) => (
              <div className="order-item" key={item._id}>
                <img src={item.productImage} alt={item.name} />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}

            {/* Order Footer */}
            <div className="order-footer">
              <p className="status">Status: {order.status}</p>
              <p className="total">Total: ₹{order.totalAmount}</p>
            </div>
<div class="deliveryCode">
           {order.deliveryCode && (
  <>
    <p className="delivery-code">
      Delivery Code : <strong>{order.deliveryCode}</strong>
      <br />
      Please share this delivery code with the delivery partner and pay ₹{order.totalAmount} at the time of delivery.
    </p>

    {order.status === "Out for Delivery" && (
      <button
        className="track-btn"
        onClick={() => trackOrder(order._id)}
      >
        Track Order
      </button>
    )}
  </>
)}
</div>

            {/* Bakery Details */}
            {order.bakerId && (
              <div className="baker-details">
                <h4>Bakery Details</h4>
                <p><strong>Name:</strong> {order.bakerId.bakeryBrandName}</p>
                <p><strong>Phone:</strong> {order.bakerId.phoneNo}</p>
                <p><strong>Address:</strong> {order.bakerId.kitchenAddress}</p>

                <a
                  href={`mailto:${order.bakerId.email}?subject=Order%20${order._id}`}
                  className="emailBtn"
                >
                  Email Baker
                </a>
              </div>
            )}

            {/* Delivery Partner Details */}
            {order.deliveryPartnerId && (
              <div className="delivery-details">
                <h4>Delivery Partner</h4>
                <p><strong>Name:</strong> {order.deliveryPartnerId.fullName}</p>
                <p><strong>Phone:</strong> {order.deliveryPartnerId.phoneNo}</p>

                <a
                  href={`tel:${order.deliveryPartnerId.phoneNo}`}
                  className="callBtn"
                >
                  Call Partner
                </a>
              </div>
            )}

            
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

export default UserOrder;