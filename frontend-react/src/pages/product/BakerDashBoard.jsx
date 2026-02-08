import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import '../css/BakerDashboard.css'

const BakerDashBoard = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    if (!user) {
  return <Navigate to="/login" />;
}
  const [products,setProducts]=useState([])
  const token = localStorage.getItem("token");
  useEffect(()=>{
    if (!token) return;
  axios.get("https://homebakerconnect.onrender.com/product/getBakerProducts",{
     headers: {
    Authorization: `Bearer ${token}`,
  }}
  )
  .then(res=>{console.log(res.data);setProducts(res.data.products)})
  .catch(error=>console.log(error))
  },[])
  return (
    <div className="baker-dashboard">
  <h1 className="bakery-title">{user.bakeryBrandName}</h1>
  <h2 className="section-title">Your Products</h2>

  <div className="bakerProducts">
    {products.map((product) => (
      <div key={product._id} className="bakerProduct">
        <img src={product.productImage} alt={product.productName} />
        <h5>{product.productName}</h5>
        <p>₹{product.price}</p>
      </div>
    ))}
  </div>

  <div className="dashboard-actions">
    <Link to="/bakerOrder" className="dash-btn secondary">
      View Received Orders
    </Link>

    <Link to="/addProduct" className="dash-btn primary">
      + Add New Product
    </Link>
  </div>
</div>

  )
}

export default BakerDashBoard