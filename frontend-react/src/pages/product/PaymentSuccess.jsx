import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/PaymentSuccess.css";
import { CheckCircleIcon } from "@heroicons/react/24/solid";


const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("orderId");
  const navigate = useNavigate();

  useEffect(() => {
    const updatePayment = async () => {
      if (orderId) {
        await axios.put(
          `https://homebakerconnect.onrender.com/payment/updatePaymentStatus/${orderId}`
        );

        setTimeout(() => {
          navigate("/userOrder");
        }, 2000);
      }
    };

    updatePayment();
  }, [orderId, navigate]);

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">
  <CheckCircleIcon style={{ width: 80, color: "#22c55e" }} />
</div>

        <h2>Payment Successful 🎉</h2>
        <p>Your order has been placed successfully.</p>
        <p>Redirecting to your orders...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
