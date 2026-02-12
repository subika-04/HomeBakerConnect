import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/UserOrder.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ==========================
// ROUTING COMPONENT
// ==========================
// ==========================
// ROUTING COMPONENT (FIXED)
// ==========================
const Routing = ({ partnerLocation, customerLocation }) => {
  const map = useMap();
  const routingRef = React.useRef(null);

  useEffect(() => {
    if (!partnerLocation || !customerLocation) return;

    if (!routingRef.current) {
      routingRef.current = L.Routing.control({
        waypoints: [
          L.latLng(partnerLocation.lat, partnerLocation.lng),
          L.latLng(customerLocation.lat, customerLocation.lng),
        ],
        addWaypoints: false,
        draggableWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: false,
        show: false,
        createMarker: () => null, // remove default markers
        lineOptions: {
          styles: [{ weight: 5 }]
        }
      }).addTo(map);
    } else {
      routingRef.current.setWaypoints([
        L.latLng(partnerLocation.lat, partnerLocation.lng),
        L.latLng(customerLocation.lat, customerLocation.lng),
      ]);
    }

  }, [partnerLocation, customerLocation, map]);

  return null;
};

  
 // User Icon (Blue Marker)
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

// Bike Icon (Delivery Partner)
const bikeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
}); 

const FitBounds = ({ partnerLocation, customerLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (partnerLocation && customerLocation) {
      const bounds = L.latLngBounds(
        [partnerLocation.lat, partnerLocation.lng],
        [customerLocation.lat, customerLocation.lng]
      );

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [partnerLocation, customerLocation, map]);

  return null;
};


const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);

  const token = localStorage.getItem("token");

  // =============================
  // FETCH USER ORDERS
  // =============================
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://homebakerconnect.onrender.com/product/getUserOrder",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data.orders);
        console.log(res.data.orders)
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 500);
    return () => clearInterval(interval);
  }, [token]);

  // =============================
  // FETCH DELIVERY PARTNER LOCATION
  // =============================
  const fetchLocation = async (orderId) => {
    try {
      const res = await axios.get(
        `https://homebakerconnect.onrender.com/delivery/getLocation/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.location) {
        setPartnerLocation(res.data.location);
      }
    } catch (error) {
      console.log("Location fetch error:", error.message);
    }
  };

  // =============================
  // TRACK ORDER
  // =============================
  const trackOrder = (order) => {
    setTrackingOrder(order);
  };

  // =============================
  // LIVE PARTNER TRACKING (5 sec interval)
  // =============================
  useEffect(() => {
    if (!trackingOrder) return;

    fetchLocation(trackingOrder._id);

    const interval = setInterval(() => {
      fetchLocation(trackingOrder._id);
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingOrder]);

  // =============================
  // LIVE CUSTOMER LOCATION
  // =============================
  useEffect(() => {
    if (!trackingOrder) return;

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCustomerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Customer location error:", error.message);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [trackingOrder]);

  const closeTracking = () => {
    setTrackingOrder(null);
    setPartnerLocation(null);
    setCustomerLocation(null);
  };

  return (
    <div className="orders-container">
      <h3>Your Orders</h3>

      {orders.length === 0 ? (
        <h3 className="no-orders">No orders yet 🍰</h3>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            {order.items.map((item) => (
              <div className="order-item" key={item._id}>
                <img src={item.productImage} alt={item.name} />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}

            <div className="order-footer">
              <p className="status">Status: {order.status}</p>
              <p className="total">Total: ₹{order.totalAmount}</p>
              <p className="total">Payment Status : Paid</p>
            </div>

            {order.deliveryCode && (
              <div className="deliveryCode">
                <p className="delivery-code">
                  Delivery Code: <strong>{order.deliveryCode}</strong>
                </p>

                {order.status === "Out for Delivery" && (
                  <button
                    className="track-btn"
                    onClick={() => trackOrder(order)}
                  >
                    Track Order
                  </button>
                )}
              </div>
            )}
            
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
            {order.bakerId && (
  <div className="delivery-details">
    <h4>Bakery Details</h4>

    <p>
      <strong>Bakery Name:</strong>{" "}
      {order.bakerId.bakeryBrandName || order.bakerId.name}
    </p>

    <p>
      <strong>Address:</strong> {order.bakerId.kitchenAddress}
    </p>

    <p>
      <strong>Contact No:</strong> {order.bakerId.phoneNo}
    </p>

    <a
      href={`tel:${order.bakerId.phoneNo}`}
      className="callBtn"
    >
      Call Bakery
    </a>
  </div>
)}

          </div>
        ))
      )}
        
      {/* =============================
           TRACKING MODAL
      ============================== */}
      {trackingOrder && (
        <div className="modal">
          <div className="modal-content">
            <h4>Live Delivery Tracking</h4>

            {partnerLocation && customerLocation && (
              <MapContainer
               
                style={{ height: "400px", width: "100%" }}
              >
                <FitBounds
  partnerLocation={partnerLocation}
  customerLocation={customerLocation}
/>

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Partner */}
 // ==========================
// CUSTOM ICONS
// ==========================


<Marker
  position={[partnerLocation.lat, partnerLocation.lng]}
  icon={bikeIcon}
  interactive={false}
/>



                {/* Customer */}
                <Marker position={[customerLocation.lat, customerLocation.lng]} icon={userIcon}>
                  <Popup>You 📍</Popup>
                </Marker>

                <Routing
                  partnerLocation={partnerLocation}
                  customerLocation={customerLocation}
                />
              </MapContainer>
            )}

            <button onClick={closeTracking}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;