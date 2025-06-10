import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaBagShopping } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import { addToCart } from '../redux/cartSlice';
import { useSelector, useDispatch } from 'react-redux';



export default function Product() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const { id } = useParams();
    const products = useSelector((state) => state.products.products);
    const productFromRedux = products.find((p) => p.id.toString() === id);
    const [product, setProduct] = useState(productFromRedux || null);
    const [loading, setLoading] = useState(!productFromRedux);
    const [error, setError] = useState(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!productFromRedux) {
            const fetchProduct = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/product/${id}`);
                    if (!res.ok) throw new Error('Product not found');
                    const data = await res.json();
                    setProduct(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchProduct();
        }
    }, [id, productFromRedux]);

    const capitalize = (str) => {
        if (!str) return str; // Check if the string is empty
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This product will be deleted!',
            icon: 'warning',
            iconColor: '#007762',
            showCancelButton: true,
            confirmButtonColor: '#007762',
            cancelButtonColor: 'black',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`http://localhost:3000/product/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete product');

            // Show success message
            await Swal.fire(
                'Deleted!',
                '#007762',
                'Your product has been deleted.',
                'success'
            );
            navigate('/');
        } catch (err) {
            // Show error message
            await Swal.fire(
                'Error!',
                err.message,
                'error',
                '#007762'
            );
        }
    };
    const handleAddToCart = () => {
        dispatch(addToCart(product)); // Dispatch the action to add product to the cart
        Swal.fire({
            icon: 'success',
            iconColor: '#007762',
            title: 'Added to Cart!',
            text: 'Your product has been added to the cart.',
            confirmButtonText: 'OK',
        });
    };
    if (loading) return <div className="text-center mt-10">Loading product...</div>;
    if (error || !product) return <div className="text-center mt-10 text-red-500">{error || 'Product not found.'}</div>;
    return (
        <div className="w-[90%] lg:w-[80%] mx-auto  mt-[50px] md:mt-[150px]">
            <div className="flex flex-col w-full md:flex-row gap-5 lg:gap-8">
                <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-full md:w-[35%] object-cover"
                />
                <div className="w-full md:w-[65%] flex flex-col min-h-[400px] ">
                    <div className='w-full flex flex-col'>
                        <h1 className="text-3xl text-[#007762] font-bold">{capitalize(product.name)}</h1>
                        <div className='flex items-center gap-1'>
                            <p className="text-gray-900 mt-2 font-[500]">Category :</p>
                            <p className="text-gray-600 mt-2">{product.category}</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <p className="text-gray-900 mt-2 font-[500]">Stock : </p>
                            <p className="text-gray-600 mt-2"> {product.stock}</p>
                        </div>
                        <div className='flex items-center gap-1 mt-5'>
                            <p className="text-gray-900 text-xl  font-[500]">Price: </p>
                            <p className="text-[#007762] text-xl font-semibold ">${product.price}</p>
                        </div>
                        <p className="mt-4 ">{product.description}</p>
                        <div className='flex items-center gap-1 '>
                            <p className="text-gray-900 mt-2 font-[500]">Created at : </p>
                            <p className="text-gray-600 mt-2 italic"> {product.createdat}</p>
                        </div>
                    </div>
                    <div className='mt-auto'>
                        {(user?.id === product.sellerId || user?.role === 'admin') && (
                            <div className='flex items-center mb-[5px] gap-2 '>
                                <button className='w-[50%] border-2 border-[#007762] text-[#007762] hover:text-white py-[6px] lg:py-[10px] rounded-[3px] hover:bg-[#007762] duration-500'>
                                    <Link to={`/editproduct/${product.id}`}>
                                        <FiEdit3 className='text-[30px] mx-auto hover:text-white' />
                                    </Link>
                                </button>
                                <button onClick={handleDelete} className='w-[49%] border-2 border-[#007762] text-[#007762] hover:text-white py-[6px] lg:py-[10px] rounded-[3px] hover:bg-[#007762] duration-500'>
                                    <MdDelete className='text-[30px] mx-auto' />
                                </button>
                            </div>
                        )}
                        <button onClick={handleAddToCart} className='btn  flex justify-center items-center mt-auto gap-[5px]'>Add to Cart <FaBagShopping /></button>
                    </div>

                </div>
            </div>
        </div>
    );
}
