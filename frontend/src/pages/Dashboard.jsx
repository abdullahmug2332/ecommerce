import React, { useEffect, useState } from 'react'
import { HiUsers } from "react-icons/hi2";
import { RiBankCard2Fill } from "react-icons/ri";
import { FaShippingFast } from "react-icons/fa";
import { BsBagCheckFill } from "react-icons/bs";

export default function Dashboard() {
    const [users, setUsers] = useState();
    const [products, setProducts] = useState();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:3000/getalluser");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:3000/allproducts");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchProducts();
    }, []);
    return (
        <div className='w-[95%] lg:w-[80%] mx-auto my-[80px] min-h-screen'>
            <h1 className='text-[40px] font-semibold p color'>Dashboard</h1>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-x-[10px]'>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 hover:scale-[1.03]'>
                    <HiUsers className='text-[60px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Total Users</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>{users?.length}+</p>
                    </div>
                </div>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 hover:scale-[1.03]'>
                    <RiBankCard2Fill className='text-[60px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Listed Products</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>{products?.length}+</p>
                    </div>
                </div>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 hover:scale-[1.03]'>
                    <FaShippingFast className='text-[60px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Total Shipings</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>570+</p>
                    </div>
                </div>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 hover:scale-[1.03]'>
                    <BsBagCheckFill className='text-[50px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Ordres Done</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>7000+</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
