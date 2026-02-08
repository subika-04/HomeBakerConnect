import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import UserRegister from './pages/auth/UserRegister'
import BakerRegister from './pages/auth/BakerRegister'
import ProductForm from './pages/product/ProductForm'
import BakerDashBoard from './pages/product/BakerDashBoard'
import Home from './pages/product/Home'
import AddToCart from './pages/product/AddToCart'
import UserOrder from './pages/product/userOrder'
import BakerOrder from './pages/product/BakerOrder'
import DeliveryDashboard from './pages/product/DeliveryDashboard'
import DeliveryRegister from './pages/auth/DeliveryRegister'
import Welcome from './pages/auth/Welcome'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/userRegister" element={<UserRegister/>}/>
        <Route path="/bakerRegister" element={<BakerRegister/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/addProduct" element={<ProductForm/>}/>
        <Route path="/baker/dashboard" element={<BakerDashBoard/>}/>
        <Route path="/user/home" element={<Home/>}/>
        <Route path="/cart" element={<AddToCart/>}/>
        <Route path="/userOrder" element={<UserOrder/>}/>
        <Route path="/bakerOrder" element={<BakerOrder/>}/>
        <Route path="/deliveryRegister" element={<DeliveryRegister/>}/>
        <Route path="//DeliveryDashboard" element={<DeliveryDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App