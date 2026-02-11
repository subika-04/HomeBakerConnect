import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import UserRegister from './pages/auth/UserRegister'
import BakerRegister from './pages/auth/BakerRegister'
import ProductForm from './pages/product/ProductForm'
import BakerDashBoard from './pages/product/BakerDashBoard'
import Home from './pages/product/Home'
import AddToCart from './pages/product/AddToCart'
import BakerOrder from './pages/product/BakerOrder'
import DeliveryDashboard from './pages/product/DeliveryDashboard'
import DeliveryRegister from './pages/auth/DeliveryRegister'
import Welcome from './pages/auth/Welcome'
import "leaflet/dist/leaflet.css";
import UserOrder from './pages/product/UserOrder'
import Layout from './pages/auth/Layout'


const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/userRegister" element={<UserRegister/>}/>
        <Route path="/bakerRegister" element={<BakerRegister/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/addProduct" element={<ProductForm/>}/>
        <Route path="/baker/dashboard" element={<BakerDashBoard/>}/>
        <Route path="/cart" element={<AddToCart/>}/>
        <Route path="/userOrder" element={<UserOrder/>}/>
        <Route path="/bakerOrder" element={<BakerOrder/>}/>
        <Route path="/deliveryRegister" element={<DeliveryRegister/>}/>
        <Route path="//DeliveryDashboard" element={<DeliveryDashboard/>}/>
        </Route>
        <Route path="/user/home" element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App