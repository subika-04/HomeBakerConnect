import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../css/UserRegister.css'


const UserRegister = () => {
    const [form,setForm]=useState(
  {
    
  fullName: "",
  email: "",
  phoneNo: "",
  username: "",
  password: "",
  confirmPassword: "",
  houseFlatNo: "",
  areaStreet: "",
  city: "",
  pincode: "" 
}
)
const navigate=useNavigate()
const handleChange=(e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value
    })
}
const handleSubmit=async(e)=>{
    e.preventDefault()
    try
    {
      const res=await axios.post("https://homebakerconnect.onrender.com/auth/userRegister",form)
      alert(res.data.message)
      navigate("/login")
      alert("Enter your Username and Password")
    }
    catch(error)
    {
      console.log(error.response);
        alert(error.response.data)
    }
}
  return (
    
    <div className='userRegister'>
<form onSubmit={handleSubmit} className='userRegister'>
<h4>Basic Information:</h4>
<label>Full Name :</label>
<input
  type="text"
  name="fullName"
  value={form.fullName}
  onChange={handleChange}
/>

<label>Email :</label>
<input
  type="email"
  name="email"
  value={form.email}
  onChange={handleChange}
/>

<label>Phone Number :</label>
<input
  type="text"
  name="phoneNo"
  value={form.phoneNo}
  onChange={handleChange}
/>
<h4>Create Username & Password:</h4>
<label>Username :</label>
<input
  type="text"
  name="username"
  value={form.username}
  onChange={handleChange}
/>

<label>Password :</label>
<input
  type="password"
  name="password"
  value={form.password}
  onChange={handleChange}
/>

<label>Confirm Password :</label>
<input
  type="password"
  name="confirmPassword"
  value={form.confirmPassword}
  onChange={handleChange}
/>

<h4>Delivery Address:</h4>
<label>House / Flat No :</label>
<input
  type="text"
  name="houseFlatNo"
  value={form.houseFlatNo}
  onChange={handleChange}
/>

<label>Area / Street :</label>
<input
  type="text"
  name="areaStreet"
  value={form.areaStreet}
  onChange={handleChange}
/>

<label>City :</label>
<input
  type="text"
  name="city"
  value={form.city}
  onChange={handleChange}
/>

<label>Pincode :</label>
<input
  type="text"
  name="pincode"
  value={form.pincode}
  onChange={handleChange}
/>
<button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default UserRegister