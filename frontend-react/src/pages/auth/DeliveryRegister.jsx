import React,{useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import "../css/DeliveryRegister.css"

const DeliveryRegister = ()=>{

 const navigate = useNavigate()

 const [form,setForm] = useState({
  fullName:"",
  email:"",
  phoneNo:"",
  city:"",
  pincode:"",
  username:"",
  password:"",
  confirmPassword:""
 })

 const handleChange = (e)=>{
  setForm({...form,[e.target.name]:e.target.value})
 }

 const handleSubmit = async (e)=>{
  e.preventDefault()

  try{
    const res = await axios.post(
      "http://localhost:9000/auth/deliveryRegister",
      form
    )

    alert(res.data.message)
    navigate("/login")

  }catch(err){
    alert(err.response?.data?.message || "Something went wrong")
  }
 }

 return(
  <div className="delivery-register-page">

    <form className="delivery-register-form" onSubmit={handleSubmit}>

      <h2>Delivery Partner Registration</h2>

      <div className="form-grid">

        <div>
          <label>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange}/>
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}/>
        </div>

        <div>
          <label>Phone Number</label>
          <input name="phoneNo" value={form.phoneNo} onChange={handleChange}/>
        </div>

        <div>
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange}/>
        </div>

        <div>
          <label>Pincode</label>
          <input name="pincode" value={form.pincode} onChange={handleChange}/>
        </div>

      </div>

      <h4>Login Credentials</h4>

      <div className="form-grid">

        <div>
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange}/>
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}/>
        </div>

        <div className="full-width">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}/>
        </div>

      </div>

      <button type="submit" className="register-btn">
        Register Delivery Partner
      </button>

    </form>

  </div>
 )
}

export default DeliveryRegister
