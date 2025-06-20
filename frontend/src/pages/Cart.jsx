import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice'; // Import actions
import { FaBagShopping } from "react-icons/fa6";
import { incrementQuantity, decrementQuantity } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { GoX } from "react-icons/go";


const Cart = () => {
    const cart = useSelector((state) => state.cart.items); // Get cart items from Redux
    const dispatch = useDispatch();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRemove = (product) => {
        dispatch(removeFromCart(product)); // Remove product from the cart
    };

    const handleClearCart = () => {
        dispatch(clearCart()); // Clear all items from the cart
    };

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0);
    };
    const handleIncrement = (product) => {
        dispatch(incrementQuantity(product));
    };

    const handleDecrement = (product) => {
        dispatch(decrementQuantity(product));
    };

    const handleRemoveproduct = (product) => {
        dispatch(removeFromCart(product));
    };
    return (
        <div className="w-[95%] md:w-[80%] mx-auto mt-[100px]">
            <div className='flex justify-center items-center gap-2 my-[40px]'>
                <h2 className="text-2xl p color text-center">My Cart</h2>
                <FaBagShopping className='text-[23px] color cursor-pointer duration-500  hover:scale-[1.08]' />
            </div>
            <div className='flex items-center' >
                <p className='w-[28%] md:w-[52%] pl-[10px] md:pl-[30px] color text-[25px] md:text-[35px]'>Product</p>
                <p className='w-[23%] md:w-[15%] text-center color'>Price</p>
                <p className='w-[23%] md:w-[15%] text-center color'>Quantity</p>
                <p className='w-[23%] md:w-[15%] text-center color'>Total</p>
            </div>
            {cart.length === 0 ? (
                <p className="text-center my-[20px]">Your cart is empty.</p>
            ) : (
                <div>
                    {cart.map((item) => (
                        <div key={item.id} >
                            <div key={item.id} className='flex  items-center my-[30px]' >
                                <div className='w-[30%] md:w-[55%] flex flex-col sm:flex-row gap-2 sm:gap-5'>
                                    <img src={`http://localhost:3000${item.image}`} alt={item.name} className="w-[150px] md:w-[200px] h-[90px] md:h-[150px] object-contain" />
                                    <div className='flex flex-col items-center sm:items-start justify-center'>
                                        <p className="text-sm sm:text-lg color text-center sm:text-start">{item.name}</p>
                                        <button onClick={() => handleRemove(item)} className="text-red-950">Remove</button>
                                    </div>
                                </div>
                                <div className='w-[23%] md:w-[15%] text-center'>
                                    <p className='text-center'>${item.price}</p>
                                </div>
                                <div className='w-[23%] md:w-[15%] flex items-center justify-center gap-2'>
                                    <button onClick={() => handleDecrement(item)} className=' w-[30px] text-[20px] border color font-bold px-[5px] rounded-[2px] border-[#007762] hover:bg-[#007762] hover:text-white'>-</button>
                                    <p className='color'> {item.quantity}</p>
                                    <button
                                        onClick={() => handleIncrement(item)}
                                        disabled={item.quantity >= item.stock}
                                        className={`w-[30px] text-[20px] border font-bold px-[5px] rounded-[2px] 
                                        ${item.quantity >= item.stock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'color border-[#007762] hover:bg-[#007762] hover:text-white'}`}> +</button>

                                </div>
                                <div className='w-[23%] md:w-[15%] text-center p'>${item.quantity * item.price}</div>
                                <GoX onClick={() => handleRemoveproduct(item)} className='self-center text-center  text-[30px] text-[#007762] hover:rotate-90 duration-500 ml-auto' />
                            </div>
                            <hr />
                        </div>
                    ))}
                    <div className="flex  mt-5">
                        <button onClick={handleClearCart} className="ml-[20px] bg-red-950 hover:bg-white hover:border-red-900  text-white hover:text-red-950 hover:border duration-500 text-[11px] md:text-[15px] px-3 md:px-4 py-1 md:py-2 rounded ">Clear Cart</button>
                        <div className="flex  gap-5  items-center ml-auto">
                            <div className='flex '>
                                <p className="text-lg md:text-xl font-semibold ">Total:$</p>
                                <p className="text-lg md:text-xl font-semibold ">{getTotalPrice()}</p>
                            </div>
                            <Link to={"/order"} className='btn text-[11px] sm:text-[15px] px-3 sm:px-4 py-1 sm:py-2 '>Order Now</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
