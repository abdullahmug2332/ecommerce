import React, { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/productsSlice';
import Products from '../components/Products';
import { BiAbacus } from "react-icons/bi";
import Swal from 'sweetalert2';

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [toggle, setToggle] = useState(true)
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12; // Items per page
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0); // total products count (optional for better pagination)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Fetch filtered products from backend with pagination
  const fetchFilteredProducts = useCallback(async () => {
    const token = Cookies.get('token');
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('page', page);
      params.append('limit', limit);

      const response = await fetch(`http://localhost:3000/filter-products?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch products');

      // Assuming your backend also returns total count for pagination, adjust accordingly
      // For example: { products: [...], total: 100 }
      const data = await response.json();
      if (Array.isArray(data)) {
        dispatch(setProducts(data));
        setTotalProducts(data.length); // fallback - no total count from backend
      } else if (data.products && data.total !== undefined) {
        dispatch(setProducts(data.products));
        setTotalProducts(data.total);
      }
      window.scrollTo(0, 0)
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      Swal.fire({
        icon: 'error',
        iconColor: '#007762',
        title: 'Error',
        text: 'Failed to load products. Please try again.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  }, [category, minPrice, maxPrice, page, limit, dispatch]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMinPrice(value);
      setPage(1); // reset page on filter change
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMaxPrice(value);
      setPage(1);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1); // reset page when category changes
  };

  // Calculate if Next button should be disabled
  const isNextDisabled = () => {
    // Disable if fetched products less than limit (means no more pages)
    return products.length < limit;
  };

  return (
    <div className="w-[95%] lg:w-[80%] mx-auto my-[80px] min-h-screen">
      <div className='flex justify-between w-full md:w-[75%] my-[50px] ml-auto px-4 relative top-[30px]'>
        <p className='text-[28px] font-bold'>Products</p>
        <Link to={"/addproduct"} className='text-[20px] text-[#007762] hover:text-[#74818F] hover:cursor-pointer hover:scale-[1.04]'>New</Link>
      </div>

      <div className='flex flex-col md:flex-row gap-[20px]'>

        {/* Filter Sidebar */}
        <div className='w-full md:w-[24%] rounded-[5px] max-h-[520px] z-[10] mb-[30px] sticky top-[90px]'>
          <div className={`${toggle == true ? "h-[57px] md:h-[530px]" : "h-auto"} overflow-hidden top-[0px] flex flex-col gap-[10px] border border-[#ddd] p-[10px] rounded-[10px]`}>
            <div className='flex justify-between items-center cursor-pointer'>
              <p className='text-[23px] text-[#007762]'>Filter</p>
              <BiAbacus className='text-[#007762] text-[25px]' onClick={() => setToggle(!toggle)} />
            </div>
            <hr />
            <div>
              {/* Price Range Filters */}
              <div className="mt-6">
                <p className="text-[#007762] font-semibold mb-2">Price Range</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="w-1/2 p-1 border border-[#007762] rounded focus:ring-0"
                  />
                  <input
                    type="text"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="w-1/2 p-1 border border-[#007762] rounded focus:ring-0"
                  />
                </div>
              </div>
              {/* Category Filter */}
              <div className='h-[350px] overflow-auto my-[20px]'>
                {["All", "Clothing", "vehicle", "Shoes", "Accessories", "Electronics", "mobile", "Health & Fitness", "Groceries", "Books & Stationery", "Sports & Outdoors", "Beauty & Personal Care"].map(cat => (
                  <p
                    key={cat}
                    onClick={() => handleCategoryChange(cat === "All" ? "all" : cat)}
                    className={`options cursor-pointer hover:text-[#007762] ${category === (cat === "All" ? "all" : cat) ? 'text-[#007762] font-semibold' : ''}`}
                  >
                    {cat}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Products Section */}
        <div className="w-full md:w-[74%] flex flex-col">
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-9 mb-4">
              {products.map((product) => (
                <Products key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => {
            if (page > 1) setPage(page - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-2 border rounded text-white bg-[#007762] hover:bg-white hover:text-[#007762] hover:border-[#007762] hover:cursor-pointer duration-500"
          disabled={page === 1}
        >
          Prev
        </button>

        <span className="px-4 py-2">Page {page}</span>

        <button
          onClick={() => {
            if (!isNextDisabled()) setPage(page + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-2 border rounded text-white bg-[#007762] hover:bg-white hover:text-[#007762] hover:border-[#007762] hover:cursor-pointer duration-500"
          disabled={isNextDisabled()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
