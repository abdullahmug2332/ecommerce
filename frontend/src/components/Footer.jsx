import React from 'react'
import { Link } from 'react-router-dom'
import { HiShoppingCart } from "react-icons/hi2";
import { FaFacebookSquare } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { useSelector } from 'react-redux';





export default function Footer() {
    const user = useSelector((state) => state.auth.user);

    return (
        <section className='w-full text-white bg-[#007762] py-[20px] mt-[30px]'>
            <div className='w-[95%] lg:w-[80%] mx-auto mt-[90px] '>
                <Link to={"/"} className='flex items-center duration-500 cursor-pointer hover:scale-[1.02]'>
                    <p className='text-[33px] md:text-[25px] lg:text-[39px] text-white'>ECommerce</p>
                    <HiShoppingCart className='text-[33px] md:text-[33px] lg:text-[33px] text-white' />
                </Link>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-y-4' >
                    <div className='flex flex-col gap-3 mt-4'>
                        <p className='text-white text-[24px] font-bold'>Need Help</p>
                        <Link to={"/"} className='text-white'>Home</Link>
                        {user && <Link to={"/addproduct"} className='text-white'>Add Product</Link>}
                        <Link to={"/contact"} className='text-white'>Contact Us</Link>
                        <p className='text-white'>Address</p>
                    </div>
                    <div className='flex flex-col gap-3 mt-4'>
                        <p className='text-white text-[24px] font-bold'>Company</p>
                        <p className='text-white'>About Us</p>
                        <p className='text-white'>Collaboration</p>
                        <p className='text-white'>Blogs</p>
                        <p className='text-white'>Location</p>
                    </div>
                    <div className='flex flex-col gap-3 mt-4'>
                        <p className='text-white text-[24px] font-bold'>More Info</p>
                        <p className='text-white'>Terms and Conditions</p>
                        <p className='text-white'>Privacy Policy</p>
                        <p className='text-white'>Shipping Policy</p>
                        <p className='text-white'>SitMap</p>
                    </div>
                    <div className='flex flex-col gap-3 mt-4'>
                        <p className='text-white text-[24px] font-bold'>Address</p>
                        <p className='text-white'>info@E.commerce.com</p>
                        <p className='text-white'>+123 456 78958</p>
                        <p className='text-white'>809 New Mistralton Hotel</p>
                        <p className='text-white'>123 Street New York, USA</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 my-[40px]'>
                    <FaFacebookSquare className='text-[36px] hover:scale-110' />
                    <GrInstagram className='text-[35px] hover:scale-110' />
                    <FaLinkedin className='text-[35px] hover:scale-110' />
                    <FaTwitter className='text-[35px] hover:scale-110' />
                </div>
                <hr />
                <ul className="w-[100%]">
                    <li>
                        <details className="group">
                            <summary className="flex items-center gap-3 py-3 font-medium marker:content-none hover:cursor-pointer ">
                                <svg className="w-5 h-5 text-white transition group-open:rotate-90" xmlns="http://www.w3.org/2000/svg"
                                    width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                                    </path>
                                </svg>
                                <span className='font-bold text-[23px]'>Popular Category </span>
                            </summary>

                            <article className="px-4 pb-4">
                                <div className='text-white flex gap-x-2 gap-y-2 flex-wrap px-[40px]'>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Clothing</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Vehicle</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Shoes</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Accessories</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Electronics</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Mobile</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Health & Fitness</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Groceries</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Books & Stationery</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Sports & Outdoors</button>
                                    <button className='border px-3 py-1 rounded-[15px] hover:cursor-pointer hover:scale-105'>Beauty & Personal Care</button>
                                </div>
                            </article>
                        </details>
                    </li>
                </ul>
                <hr />
                <p className='text-white text-center mt-5'>© 2025 Ecommerce || All rights reserved </p>
            </div>
        </section>
    )
}