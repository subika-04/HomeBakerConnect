import React, { useEffect, useState } from "react"
import axios from "axios"

const TrackOrderModal = ({ orderId, onClose }) => {

  const [location, setLocation] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await axios.get(
        `https://homebakerconnect.onrender.com/delivery/track/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setLocation(res.data.location)
    }

    fetchLocation()
    const interval = setInterval(fetchLocation, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!location) return <p>Waiting for delivery partner...</p>

  return (
    <div className="modal">
      <h3>Live Delivery Tracking 🚚</h3>

      <iframe
        title="map"
        width="100%"
        height="300"
        loading="lazy"
        src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
      />

      <button onClick={onClose}>Close</button>
    </div>
  )
}

export default TrackOrderModal
