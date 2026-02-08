import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/BakerRegister.css'

const BakerRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bakerName: "",
    email: "",
    phoneNo: "",
    bakeryBrandName: "",
    typeOfBaker: "",
    yearsOfExperience: "",
    kitchenAddress: "",
    city: "",
    pincode: "",
    specialities: "",
    mode: "",
    customOrdersSupported: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://homebakerconnect.onrender.com/auth/bakerRegister",
        form
      );
      alert(res.data.message);
      navigate("/login");
      alert("Enter your Username and Password");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="baker-register-page">
      <form className="baker-register-form" onSubmit={handleSubmit}>
        
        <h4>Personal Information</h4>
        <div className="form-grid">
          <div>
            <label>Baker Name</label>
            <input name="bakerName" value={form.bakerName} onChange={handleChange} />
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="full-width">
            <label>Phone Number</label>
            <input name="phoneNo" value={form.phoneNo} onChange={handleChange} />
          </div>
        </div>

        <h4>Business Information</h4>
        <div className="form-grid">
          <div>
            <label>Bakery Brand</label>
            <input name="bakeryBrandName" value={form.bakeryBrandName} onChange={handleChange} />
          </div>

          <div>
            <label>Type of Baker</label>
            <select name="typeOfBaker" value={form.typeOfBaker} onChange={handleChange}>
              <option value="">Select</option>
              <option>Home Baker</option>
              <option>Cloud Kitchen</option>
            </select>
          </div>

          <div>
            <label>Experience (Years)</label>
            <input type="number" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} />
          </div>
        </div>

        <h4>Address</h4>
        <div className="form-grid">
          <div className="full-width">
            <label>Kitchen Address</label>
            <input name="kitchenAddress" value={form.kitchenAddress} onChange={handleChange} />
          </div>

          <div>
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div>
            <label>Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} />
          </div>
        </div>

        <h4>Food Details</h4>
        <div className="form-grid">
          <div>
            <label>Specialities</label>
            <select name="specialities" value={form.specialities} onChange={handleChange}>
              <option value="">Select</option>
              <option>Cakes</option>
              <option>Snacks</option>
              <option>Sweets & Breads</option>
              <option>All</option>
            </select>
          </div>

          <div>
            <label>Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange}>
              <option value="">Select</option>
              <option>Veg</option>
              <option>Non-veg</option>
              <option>Both</option>
            </select>
          </div>

          <div className="full-width">
            <label>Custom Orders Supported</label>
            <select
              name="customOrdersSupported"
              value={form.customOrdersSupported}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <h4>Login Credentials</h4>
        <div className="form-grid">
          <div>
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </div>

          <div className="full-width">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit">Register Baker</button>
      </form>
    </div>
  );
};

export default BakerRegister;
