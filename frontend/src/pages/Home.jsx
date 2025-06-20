import React, { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/productsSlice';
import Products from '../components/Products';
import { BiAbacus } from "react-icons/bi";
import Swal from 'sweetalert2';
import user1 from "../assets/user1.jfif"
import user2 from "../assets/user2.jfif"
import user3 from "../assets/user3.jfif"

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
    <>

      <section className="hero2 text-[#007762] w-[100%] h-[850px] relative ">
        <div className="w-[95%] lg:w-[80%] mx-auto  min-h-[600px] px-4 py-24 md:py-32">
          <div className="max-w-lg mt-[80px]">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ecommerce Store
            </h1>
            <p className="text-lg text-white mb-8">
              Step into a world of modern fashion made for everyday confidence. Our handpicked collection blends comfort with timeless style.
            </p>
            <p className="text-lg text-white mb-8">
              From casual essentials to standout pieces — explore premium quality that speaks for itself. Style up your wardrobe with ease.
            </p>

            <div className="flex  flex-col md:flex-row justify-start flex-wrap gap-4">
              <Link
                to={"/cart"}
                className="py-3 px-6 bg-primary text-white font-medium hover:underline w-[150px]" > Shop Now
              </Link>
              <a href='#products'
                className="py-3 px-6 bg-white text-gray-800 font-medium rounded-button border border-gray-200 hover:bg-transparent hover:text-white hover:border hover:border-white rounded-[2px] w-[180px]" >Explore Products
              </a>
            </div>
          </div>
        </div>
      </section>  

      <div className="w-[95%] lg:w-[80%] mx-auto my-[80px] min-h-screen">
        <div className='flex justify-between w-full md:w-[75%] my-[50px] ml-auto px-4 relative top-[30px]' id='products'>
          <p className='text-[28px] font-bold ' >Products</p>
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

        {/* What Our Customers Say */}
        <section className="py-16 mt-[20px]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#007762]">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col justify-between">
                <p className="text-gray-700 ">
                  "The quality of the clothes is exceptional. I've ordered multiple
                  times and have never been disappointed. The customer service is
                  also top-notch!"
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center mr-[10px]">
                    <img src={user1} className='w-[50px] h-[50px] object-cover rounded-full' />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#007762]">Emily Richardson</h4>
                    <p className="text-sm text-gray-500">Loyal Customer</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col justify-between">
                <p className="text-gray-700 ">
                  "Fast shipping and the products look exactly like the pictures.
                  The sizing guide was very helpful. Will definitely shop here
                  again!"
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center mr-[10px]">
                    <img src={user2} className='w-[50px] h-[50px] object-cover rounded-full' />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#007762]">Michael Thompson</h4>
                    <p className="text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col justify-between">
                <p className="text-gray-700 ">
                  "I love the sustainable approach this brand takes. The packaging
                  is eco-friendly and the clothes are made from high-quality,
                  sustainable materials."
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center mr-[10px]">
                    <img src={user3} className='w-[50px] h-[50px] object-cover rounded-full' />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#007762]">Sophia Martinez</h4>
                    <p className="text-sm text-gray-500">Repeat Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
