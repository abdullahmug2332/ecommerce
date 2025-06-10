import React, { useState, useEffect } from 'react';
import restock from "../assets/restock.jpg";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Products from '../components/Products';
import { setProducts } from '../redux/productsSlice';
import Swal from 'sweetalert2';

export default function AddProduct() {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        iconColor: '#007762',
        title: 'Please Login!',
        text: 'You have to Log in first',
        confirmButtonColor: '#d33',
      });
      navigate('/auth');
    }
  }, [token]);
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.products.products);
  const myProducts = products.filter(product => product.sellerId === user.id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.products) {
        dispatch(setProducts(data.products));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ✅ Fetch products on first render
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("sellerId", user.id);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:3000/addproduct", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          iconColor: '#007762',

          title: 'Product Added!',
          text: 'Your product has been successfully listed.',
          confirmButtonColor: '#007762'
        });

        fetchProducts();

        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setCategory("");
        setImage(null);

        navigate("/");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          iconColor: '#007762',
          text: data.message || "Failed to add product.",
          confirmButtonColor: '#d33'
        });
      }
    } catch (err) {
      console.error("Product submission error:", err);
    }
  };

  return (
    <>
      <section className='w-[100%] h-[625px]  flex gap-[30px] my-[50px] shadow-xl min-h-[100vh]'>
        <div className='w-[35%] hidden md:block'>
          <img src={restock} className='w-[100%] h-[100%] object-cover' alt="Visual" />
        </div>
        <form onSubmit={handleSubmit} className='w-full flex flex-col max-h-[700px] overflow-hidden md:w-[60%] px-[30px] py-[20px]'>
          <div className='py-[20px] lg:py-[30px]'>
            <h1 className='text-[40px] font-semibold p color'>Add New Product</h1>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input'
            type="text"
            placeholder='Product Name'
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='input'
            placeholder='Product Description'
            required
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='input'
            type="number"
            placeholder='Price'
            required
          />
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className='input'
            type="number"
            placeholder='Stock Quantity'
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="Clothing">Clothing</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Mobile">Mobile</option>
            <option value="Health & Fitness">Health & Fitness</option>
            <option value="Groceries">Groceries</option>
            <option value="Books & Stationery">Books & Stationery</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className='input'
            accept="image/*"
            required
          />
          <button className='btn mt-[20px]' type="submit">
            Add Product
          </button>
        </form>
      </section>

      <div className="w-[85%] mx-auto my-[80px]">
        <h1 className='text-[40px] font-semibold p color'>Your Products</h1>

        <div className="md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {myProducts.length === 0 ? (
            <p>No products available.</p>
          ) : (
            myProducts.map((product) => (
              <Products key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
