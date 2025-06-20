import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart } from '../redux/cartSlice';
import { GoX } from "react-icons/go";

export default function Order() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart.items);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch(); 
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        if (user === null) {
            navigate("/auth");
        }
    }, [user]);

    if (!user) return null;

    const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
    const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
    const [email, setEmail] = useState(user.email)
    const [code, setCode] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [zip, setZip] = useState("")

    const handleRemove = (product) => {
        dispatch(removeFromCart(product));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    return (
        <section className='w-[95%] md:w-[80%] flex flex-col md:flex-row gap-4 mx-auto mt-[100px]'>
            <div className='w-[100%] md:w-[60%] lg:w-[70%] px-[20px] py-[20px] shadow-md'>
                <p className='text-[25px] color ml-[10px]'>Billing Address</p>
                <form className='flex flex-col items-center'>
                    <div className='flex  gap-2 w-full'>
                        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className='input w-full' type="text" placeholder='First Name' />
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className='input' type="text" placeholder='Last Name' />
                    </div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='input' type="email" placeholder='Email Address' />
                    <div className='flex gap-2 w-full'>
                        <select value={code} onChange={(e) => setCode(e.target.value)} className='input'>
                            <option value="+81">+81</option>
                            <option value="+92">+92</option>
                            <option value="+91">+91</option>
                        </select>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className='input' type="number" placeholder='Phone Number' />
                    </div>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className='input' type="text" placeholder='Street Address' />
                    <div className='flex gap-2 w-full'>
                        <input value={city} onChange={(e) => setCity(e.target.value)} className='input' type="text" placeholder='City' />
                        <input value={zip} onChange={(e) => setZip(e.target.value)} className='input' type="text" placeholder='Zip Code' />
                    </div>
                    <button className='btn mt-[20px]'>Order Now</button>
                </form>
            </div>

            <div className='shadow-md w-full md:w-[40%] lg:w-[30%] p-[20px] h-[500px] md:max-h-[430px]'>
                <p className='color text-[25px]'>Products</p>
                <div className='flex flex-col items-center h-[80%] overflow-y-auto overflow-x-hidden pr-[10px]'>
                    {cart.length === 0 ? (
                        <p className="text-center my-[20px]">Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className='w-full h-[100px] mb-3 flex gap-2'>
                                <Link to={"/cart"} className='w-[100px]'>
                                    <img src={`http://localhost:3000${item.image}`} alt={item.name} className='w-full h-[90px] object-cover rounded-md' />
                                </Link>
                                <div className='flex justify-between w-[80%] over'>
                                    <div>
                                        <p className='font-semibold color '>{item.name}</p>
                                        <p className='text-sm'>Qty: {item.quantity}</p>
                                        <p className='text-sm color'>Price: ${item.price}</p>
                                    </div>
                                    <GoX onClick={() => handleRemove(item)} className='self-center text-center  text-[30px] text-[#007762] hover:rotate-90 duration-500 ml-auto'  />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className='flex justify-between px-2 mt-[10px]'>
                    <p className='text-[25px]'>Total </p>
                    <p className='color text-[25px] font-bold'>${getTotalPrice()}</p>
                </div>
            </div>
        </section>
    );
}
