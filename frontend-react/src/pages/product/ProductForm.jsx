import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../css/ProductForm.css";


const ProductForm = () => {
    const [form,setForm]=useState({
        productName:"", 
        category:"",
        productImage:"", 
        mode:"", 
        description:"", 
        customization:"", 
        price:"", 
        preparationTime:""
    })
    const navigate=useNavigate()
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("productName", form.productName);
    formData.append("category", form.category);
    formData.append("productImage", form.productImage); // FILE
    formData.append("mode", form.mode);
    formData.append("description", form.description);
    formData.append("customization", form.customization);
    formData.append("price", form.price);
    formData.append("preparationTime", form.preparationTime);

    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:9000/product/addProduct",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

    alert(res.data.message);
    navigate("/baker/dashboard")

  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
    console.log(error.response)
  }
};

    const handleChange=(e)=>{setForm({...form,[e.target.name]:e.target.value})}
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        setForm(
            {
                ...form,
                productImage:file
            }
        )
    }
  return (
    <div  className="product-form-page">
        <form onSubmit={handleSubmit}  className="product-form" >
      <h4>Product Information</h4>
<label>Product Name :</label>
<input
  type="text"
  name="productName"
  value={form.productName}
  onChange={handleChange}
/>

<label>Category :</label>
<input
  type="text"
  name="category"
  value={form.category}
  onChange={handleChange}
/>

<label>Product Image (URL) :</label>
<input
  type="file"
  name="productImage"
  accept="image/*"
  onChange={handleImageChange}
/>
<h4>Food Details</h4>
<label>Mode :</label>
<select
  name="mode"
  value={form.mode}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Veg">Veg</option>
  <option value="Non-veg">Non-veg</option>
  <option value="Eggless">Eggless</option>
</select>

<label>Description :</label>
<input
  name="description"
  value={form.description}
  onChange={handleChange}
/>

<label>Customization :</label>
<select
  name="customization"
  value={form.customization}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>
<h4>Pricing</h4>
<label>Price Details(1 piece):</label>
<input
  type="number"
  name="price"
  value={form.price}
  onChange={handleChange}
/>
<h4>Order Details</h4>
<label>Preparation Time (mins) :</label>
<input
  type="number"
  name="preparationTime"
  value={form.preparationTime}
  onChange={handleChange}
/>
<button type='submit'>Add Product</button>
</form>
    </div>
  )
}

export default ProductForm