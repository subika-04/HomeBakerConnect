import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/Navbar.css"
import logo from "../../assets/logo2.png"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate("/welcome", { replace: true })
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
        <span>BakeCloud</span>
      </div>

      <div className="navbar-right" ref={dropdownRef}>
        <div className="dots" onClick={() => setOpen(!open)}>
          ⋮
        </div>

        {open && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
