import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../css/Login.css'

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("https://homebakerconnect.onrender.com/auth/login", form)
      localStorage.setItem("user", JSON.stringify(res.data.existingUser))
      localStorage.setItem("token", res.data.token)

      if (res.data.role === 'User') navigate("/user/home")
else if (res.data.role === 'Baker') navigate("/baker/dashboard")
else if (res.data.role === 'Delivery') navigate("/DeliveryDashboard")


    } catch (error) {
      alert(error.response.data)
    }
  }

  const handleBaker = () => {
    setShowModal(false)
    navigate("/bakerRegister")
  }

  const handleUser = () => {
    setShowModal(false)
    navigate("/userRegister")
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <p className="register-text">
          Don’t have an account?
          <span className="register-link" onClick={() => setShowModal(true)}>
            Register
          </span>
        </p>
      </form>

      {/* MODAL */}
      {showModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-box">
            <h4>Do you want to sell products in our app?</h4>

            <div className="login-modal-buttons">
              <button className="baker-btn" onClick={handleBaker}>
                Yes, I am a Baker
              </button>

              <button className="user-btn" onClick={handleUser}>
                No, I am a Customer
              </button>

              <button onClick={()=>navigate("/deliveryRegister")}>
   I am Delivery Partner
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
