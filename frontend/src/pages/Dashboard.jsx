import React, { useEffect, useState } from 'react'
import { HiUsers } from "react-icons/hi2";
import { RiBankCard2Fill } from "react-icons/ri";
import { FaShippingFast } from "react-icons/fa";
import { BsBagCheckFill } from "react-icons/bs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function Dashboard() {
    const [users, setUsers] = useState();
    const [products, setProducts] = useState();
    const [filter, setFilter] = useState("year"); // Options: year, month, week
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        if (!products) return;

        const now = new Date();
        const groupedData = {};

        products.forEach((product) => {
            const date = new Date(product.createdat);
            let key = "";

            if (filter === "year") {
                key = date.getMonth(); // 0-11
            } else if (filter === "month") {
                key = date.getDate(); // 1-31
            } else if (filter === "week") {
                key = date.getDay(); // 0-6 (Sunday to Saturday)
            }

            if (!groupedData[key]) {
                groupedData[key] = 1;
            } else {
                groupedData[key]++;
            }
        });

        let formattedData = [];

        if (filter === "year") {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            formattedData = Array.from({ length: 12 }, (_, i) => ({
                name: monthNames[i],
                count: groupedData[i] || 0
            }));
        } else if (filter === "month") {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            formattedData = Array.from({ length: daysInMonth }, (_, i) => ({
                name: `${i + 1}`,
                count: groupedData[i + 1] || 0
            }));
        } else if (filter === "week") {
            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            formattedData = weekDays.map((day, i) => ({
                name: day,
                count: groupedData[i] || 0
            }));
        }

        setChartData(formattedData);
    }, [products, filter]);


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
            <div className='grid grid-cols-2 md:grid-cols-4 gap-[10px]'>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 '>
                    <HiUsers className='text-[60px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Total Users</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>{users?.length}+</p>
                    </div>
                </div>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 '>
                    <RiBankCard2Fill className='text-[60px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Listed Products</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>{products?.length}+</p>
                    </div>
                </div>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 '>
                    <FaShippingFast className='text-[60px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Total Shipings</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>570+</p>
                    </div>
                </div>
                <div className='group border-[2px] rounded-[5px] border-[#007762] hover:bg-[#007762] hover:cursor-pointer flex items-center gap-[10px] px-[20px] py-[7px] duration-500 '>
                    <BsBagCheckFill className='text-[50px] color group-hover:text-white' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] group-hover:text-white'>Ordres Done</p>
                        <p className='color group-hover:text-white font-bold text-[17px]'>7000+</p>
                    </div>
                </div>
            </div>
            <div className="my-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold color">Product Listings Graph</h2>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-[#007762] text-[#007762] focus:outline-0 hover:cursor-pointer rounded px-3 py-1"
                    >
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                    </select>
                </div>
                <ResponsiveContainer  height={400} className=" w-full ">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone"
                            dataKey="count"
                            stroke="#007762"
                            strokeWidth={2}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                            isAnimationActive={true}
                            animationBegin={300}
                            animationDuration={900}
                            animationEasing="ease-in" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}
