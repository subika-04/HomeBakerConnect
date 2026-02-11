import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import "../css/Layout.css"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout
