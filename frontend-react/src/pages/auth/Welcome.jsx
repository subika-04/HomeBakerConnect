import React from "react"
import { useNavigate } from "react-router-dom"
import "../css/Welcome.css"

const Welcome = () => {

  const navigate = useNavigate()

  return (
    <div className="welcome-container">

      {/* Animated background blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="welcome-card">

        <h1 className="welcome-title">
          Welcome to <span>BakeCloud 🍰</span>
        </h1>

        <p className="welcome-subtitle">
          Fresh bakes • Fast delivery • Smart tracking
        </p>

        <button
          className="start-btn"
          onClick={() => navigate("/login")}
        >
          Get Started →
        </button>

      </div>
    </div>
  )
}

export default Welcome
