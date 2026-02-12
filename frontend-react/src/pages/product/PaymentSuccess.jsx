import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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

  return <h2>Payment Successful 🎉 Redirecting...</h2>;
};

export default PaymentSuccess;
