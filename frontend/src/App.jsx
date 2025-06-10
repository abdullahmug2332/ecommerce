import './App.css'
import Navbar from './components/Navbar'
import Auth from './pages/Auth'
import ForgetPass from './pages/ForgetPass';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import AddProduct from './pages/addProduct';
import Product from './pages/Product';
import EditProduct from './pages/editProduct';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Order from './pages/Order';
import AllUsers from './pages/AllUsers';
import AdminRoutes from './pages/AdminRoutes';
import Routecheck from './pages/Routecheck';
import Dashboard from './pages/Dashboard';
import AllProducts from './pages/AllProducts';
import { useEffect } from 'react';



function App() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgetpass" element={<ForgetPass />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route element={<AdminRoutes />}>
            <Route path="/allusers" element={<AllUsers />} />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        <Route path="*" element={<Routecheck/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
