import { useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: ''
    });
    const [page, setPage] = useState(1);
    const limit = 10; // You can change it as needed
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`http://localhost:3000/allproducts?page=${page}&limit=${limit}`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    const fetchFilteredProducts = async () => {
        const query = new URLSearchParams({
            ...filters,
            page,
            limit
        }).toString();

        try {
            const res = await fetch(`http://localhost:3000/filter-products?${query}`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error filtering products:", error);
        }

    };


    useEffect(() => {
        fetchProducts();
    }, []);
    useEffect(() => {
        fetchFilteredProducts();
    }, [page]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the product.',
            icon: 'warning',
            iconColor: '#007762',
            showCancelButton: true,
            confirmButtonColor: '#007762',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:3000/product/${id}`, {
                    method: "DELETE",
                });

                const data = await res.json();

                if (res.ok) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: data.message,
                        icon: 'success',
                        confirmButtonColor: '#007762'
                    });
                    fetchProducts(); // Refresh the list
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || "Error deleting product.",
                        icon: 'error',
                        confirmButtonColor: '#007762'
                    });
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                Swal.fire({
                    title: 'Error!',
                    iconColor: '#007762',
                    text: 'Something went wrong while deleting.',
                    icon: 'error',
                    confirmButtonColor: '#007762'
                });
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <section className='w-[95%] lg:w-[80%] mx-auto my-[80px] min-h-screen '>

            {/* Filters */}
            <div className="flex gap-4 mb-6 flex-wrap justify-center md:justify-start">
                <select name="category" value={filters.category} onChange={handleFilterChange} className="border w-[160px] p-2 rounded bg-[#007762] text-white focus:outline-0 hover:cursor-pointer hover:scale-105 duration-500 text-center" >
                    <option value="">All Categories</option>
                    <option value="Clothing" className="bg-white text-[#007762]">Clothing </option>
                    <option value="vehicle" className="bg-white text-[#007762]">vehicle </option>
                    <option value="Shoes" className="bg-white text-[#007762]">Shoes </option>
                    <option value="Accessories" className="bg-white text-[#007762]">Accessories </option>
                    <option value="Electronics" className="bg-white text-[#007762]">Electronics </option>
                    <option value="mobile" className="bg-white text-[#007762]">mobile </option>
                    <option value="Health & Fitness" className="bg-white text-[#007762]">Health & Fitness </option>
                    <option value="Groceries" className="bg-white text-[#007762]">Groceries </option>
                    <option value="Books & Stationery" className="bg-white text-[#007762]">Books & Stationery </option>
                    <option value="Sports & Outdoors" className="bg-white text-[#007762]">Sports & Outdoors </option>
                    <option value="Beauty & Personal Care" className="bg-white text-[#007762]">Beauty & Personal Care </option>
                </select>
                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" className="border p-2 rounded w-[105px]" />
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" className="border p-2 rounded w-[105px]" />
                <button onClick={() => { setPage(1); fetchFilteredProducts(); }} className="bg-[#007762] text-white px-4 py-2 rounded  md:ml-auto hover:bg-white hover:border hover:border-[#007762] hover:text-[#007762] duration-500">
                    Apply Filters
                </button>
                <button onClick={() => { setFilters({ category: '', minPrice: '', maxPrice: '' }); fetchProducts(); }} className="text-[#007762] border px-4 py-2 rounded hover:cursor-pointer hover:scale-105 duration-500">
                    Clear Filters
                </button>
            </div>

            {/* Table */}
            {
                products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-[970px] w-full border border-gray-300">
                            <thead className="bg-[#007762] text-white">
                                <tr>
                                    <th className="p-3 border font-semibold">ID</th>
                                    <th className="p-3 border font-semibold">Image</th>
                                    <th className="p-3 border font-semibold">Name</th>
                                    <th className="p-3 border font-semibold">Price</th>
                                    <th className="p-3 border font-semibold">Stock</th>
                                    <th className="p-1 border font-semibold">Category</th>
                                    <th className="p-3 border font-semibold">Seller ID</th>
                                    <th className="p-3 border font-semibold">Created</th>
                                    <th className="p-3 border font-semibold">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="text-center">
                                        <td className="p-3 border">{product.id}</td>
                                        <td className="p-3 border">
                                            <Link to={`/product/${product.id}`}
                                            >
                                                <img
                                                    src={`http://localhost:3000${product.image}`}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded object-cover mx-auto hover:scale-110 duration-500"
                                                />
                                            </Link>

                                        </td>
                                        <td className="p-3 border">
                                            <Link to={`/product/${product.id}`} className="hover:text-[#007762] hover:underline">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="p-3 border">${product.price}</td>
                                        <td className="p-3 border">${product.stock}</td>
                                        <td className="p-1 border">{product.category}</td>
                                        <td className="p-3 border">{product.sellerId}</td>
                                        <td className="p-3 border">{product.createdat}</td>
                                        <td className="p-3 border">
                                            <button onClick={() => handleDelete(product.id)}>
                                                <GoX className="text-center mx-auto text-[30px] text-[#007762] hover:rotate-90 duration-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-center mt-6 gap-4">
                            <button
                                onClick={() => {
                                    if (page > 1) setPage(page - 1);
                                    window.scrollTo(0, 0)

                                }}
                                className="px-4 py-2 border rounded text-white bg-[#007762] hover:bg-white hover:text-[#007762] hover:border-[#007762] hover:scale-100 hover:cursor-pointer duration-500"
                                disabled={page === 1}
                            >
                                Prev
                            </button>

                            <span className="px-4 py-2">Page {page}</span>

                            <button
                                onClick={() => {
                                    setPage(page + 1);
                                    window.scrollTo(0, 0)
                                }}
                                className="px-4 py-2 border rounded text-white bg-[#007762] hover:bg-white hover:text-[#007762] hover:border-[#007762] hover:scale-100 hover:cursor-pointer duration-500"
                                disabled={products?.length < 10}
                            >
                                Next
                            </button>

                        </div>

                    </div>
                ) : (
                    <p className="text-center text-gray-500">No Products Found</p>
                )
            }
        </section>
    );
}
