import React, { useEffect, useState } from 'react';
import { HiShoppingCart, HiMiniXMark } from "react-icons/hi2";
import { FaBagShopping } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import userimg from "../assets/userimg.png";
import logo from "../assets/logo.png"

export default function Navbar() {
    const [toggle, setToggle] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchUser = async () => {
            const userCookie = Cookies.get('user');
            if (!userCookie || !token) return;
            try {
                const user = JSON.parse(userCookie);
                const id = user.id
                const res = await axios.post('http://localhost:3000/getuser', { id });
                const fetchedUser = res.data;

                dispatch(setCredentials({ user: fetchedUser, token }));
                Cookies.set('user', JSON.stringify({ id: fetchedUser.id, name: fetchedUser.name }));
            } catch (err) {
                console.error("Fetch user failed:", err);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: `Are you sure you want to logout, ${user?.name}?`,
            text: "You will be logged out of your account.",
            icon: 'warning',
        iconColor: '#007762',
            showCancelButton: true,
            confirmButtonColor: '#007762',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logout());
                Cookies.remove("token");
                Cookies.remove("user");
                Cookies.remove("role");
                navigate("/auth");
                setToggle(false);
                Swal.fire('Logged out!', `${user?.name} has been logged out successfully.`, 'success','#007762',);
            }
        });
    };

    return (
        <div className='relative'>
            <section className='fixed z-30 bg-white top-0 left-0 w-full border shadow-md py-[10px] md:py-[0px]'>
                <div className='w-[95%] lg:w-[80%] flex items-center mx-auto '>
                    <Link to={"/"} className='flex items-end duration-500 cursor-pointer hover:scale-[1.04]'>
                        <img src={logo} className='w-[180px]' />
                    </Link>

                    {/* Desktop Nav */}
                    <ul className='items-center ml-auto hidden md:flex text-[#74818F] gap-0'>
                        <Link to="/" className='navlink'>Home</Link>
                        {user?.role == "admin" && <Link to="/dashboard" className='navlink'>Dashboard</Link>}
                        {user?.role == "admin" && <Link to="/allusers" className='navlink'>Users</Link>}
                        {user?.role == "admin" && <Link to="/allproducts" className='navlink'>Products</Link>}
                        { token && <Link to="/addproduct" className='navlink whitespace-nowrap'>Add Product</Link>}
                        <Link to="/contact" className='navlink'>Contact</Link>
                    </ul>

                    {user && (
                        <Link to="/profile" className='hidden md:block ml-5'>
                            <img
                                src={user?.userimg ? `http://localhost:3000${user.userimg}` : userimg}
                                className='h-[40px] w-[40px] object-cover rounded-full transition-all duration-500 cursor-pointer hover:scale-[1.08]'
                                alt="user"
                            />
                        </Link>
                    )}

                    {user?.role != "admin" && <div className="ml-5 hidden md:block">
                        <Link to="/cart">
                            <FaBagShopping className='text-[23px] text-[#007762] cursor-pointer transition duration-300 hover:scale-110' />
                        </Link>
                    </div>}

                    {!token ? (
                        <div className="ml-5 hidden md:block">
                            <button onClick={() => navigate("/auth")} className="btn px-[20px]">Login</button>
                        </div>
                    ) : (
                        <div className="ml-5 hidden md:block">
                            <button onClick={handleLogout} className="btn px-[20px]">Logout</button>
                        </div>
                    )}

                    {/* Mobile Profile Image */}
                    {user && (
                        <Link to="/profile" className='block md:hidden absolute top-[20px] right-[70px]'>
                            <img
                                src={user.userimg ? `http://localhost:3000${user.userimg}` : userimg}
                                className='h-[35px] w-[35px] object-cover rounded-full hover:rounded-full transition-all duration-500 cursor-pointer hover:scale-[1.08] '
                                alt="user"
                            />
                        </Link>
                    )}

                    {/* Mobile Toggle Button */}
                    <div className='ml-auto block md:hidden'>
                        <GiHamburgerMenu onClick={() => setToggle(true)} className='text-[29px] text-[#007762] cursor-pointer duration-300 hover:scale-110' />
                    </div>
                </div>
            </section>

            {/* Mobile Menu */}
            <div className={`${toggle ? "translate-x-0" : "translate-x-full"} fixed top-0 right-0 z-40 w-[280px] h-screen bg-[#007762] transition-transform duration-500 block md:hidden`}>
                <HiMiniXMark onClick={() => setToggle(false)} className='text-white text-[45px] absolute top-3 right-3 cursor-pointer duration-300 hover:scale-110 hover:rotate-90' />

                <ul className='flex flex-col text-center mt-20 text-white font-medium overflow-scroll h-full'>
                    <Link to="/" onClick={() => setToggle(false)} className='mobnavlink'>Home</Link>
                    {user?.role == "admin" && <Link to="/dashboard" onClick={() => setToggle(false)} className='mobnavlink'>Dashboard</Link>}
                    {user?.role == "admin" && <Link to="/allusers" onClick={() => setToggle(false)} className='mobnavlink'>Users</Link>}
                    {user?.role == "admin" && <Link to="/allproducts" onClick={() => setToggle(false)} className='mobnavlink'>Products</Link>}
                    <Link to="/addproduct" onClick={() => setToggle(false)} className='mobnavlink'>Add Product</Link>
                    <Link to="/cart" onClick={() => setToggle(false)} className='mobnavlink'>Cart</Link>
                    <Link to="/contact" onClick={() => setToggle(false)} className='mobnavlink'>Contact</Link>
                    {user ? (
                        <button onClick={handleLogout} className='mobnavlink'>Logout</button>
                    ) : (
                        <Link to="/auth" onClick={() => setToggle(false)} className='mobnavlink '>Login</Link>
                    )}
                </ul>
            </div>
        </div>
    );
}
