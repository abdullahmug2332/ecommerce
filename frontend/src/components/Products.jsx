import React from 'react'
import { Link } from 'react-router-dom'
import { FaEye } from "react-icons/fa";


export default function Products(props) {
    const capitalize = (str) => {
  if (!str) return str; // Check if the string is empty
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
    return (
        <Link to={`/product/${props.product.id}`} key={props.product.id} className="w-[100%] h-[440px] rounded-sm overflow-hidden shadow-xl  relative hover:scale-[1.02] duration-500">
            <img
                src={`http://localhost:3000${props.product.image}`}
                alt={props.product.name}
                className="w-full h-[55%] object-cover "
            />
            <div className="p-4 h-[45%] flex flex-col">
                <h3 className="text-xl font-semibold text-[#007762]">{capitalize(props.product.name)}</h3>
                <p className="text-sm text-gray-600 mt-2 ">{props.product.category}</p>
                <div className='mt-auto'>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-semibold text-[#007762]">${props.product.price}</span>
                        <span className={`text-sm ${props.product.stock > 0 ? 'text-[#007762]' : 'text-red-500'}`}>
                            {props.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <button
                        className="flex justify-center items-center gap-[5px] mt-4 w-[100%] py-2 btn "
                        disabled={props.product.stock <= 0}>View<FaEye />
                    </button>
                </div>
            </div>
        </Link>
    )
}
