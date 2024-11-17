import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import Footer from '../../components/Footer';
import image3 from '../../assets/image/image3.jpg';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules'; // Import Pagination module from Swiper
import 'swiper/swiper-bundle.css'; // Import Swiper styles

const Market = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
      fetchProducts();
  }, []);

  const fetchProducts = async () => {
      try {
          const response = await axios.get('http://localhost:7684/api/finishGoods');
          if (Array.isArray(response.data)) {
              const launchedProducts = response.data.filter(product => product.launchStatus === 'Launched');
              setProducts(launchedProducts); 
          } else {
              console.warn("Products not in expected format", response.data);
          }
      } catch (error) {
          console.error("Error fetching products:", error);
      }
  };

  return (
    <>
     <div className='bg-white flex flex-col min-h-screen'>
      <Navbar />
        <div className='flex-grow'>
          <section className="bg-center bg-no-repeat bg-cover bg-gray-700 bg-blend-multiply" style={{ backgroundImage: `url(${image3})` }}>
            <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">Welcome to JJM Soap and Detergent</h1>
              <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">Discover high-quality products that make a difference.</p>
              
            </div>
          </section>

          <div className="flex justify-center items-center mt-20">
            <div className="w-full max-w-7xl p-4">
              <div className='flex justify-between mb-3 items-center'>
                <h2 className="text-2xl font-bold mb-4 text-center ml-5">Latest Products</h2>
                <a href='/market/allproducts' className='mr-5 flex font-bold text-sm items-center px-4 py-2 rounded-lg hover:bg-green-400'>SEE ALL
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                  </svg>
                </a>
              </div>
              
              <Swiper
                modules={[Pagination]} 
                pagination={{
                  el: '.custom-pagination', 
                  clickable: true,
                }} 
                className="mb-8"
                breakpoints={{
                  640: { slidesPerView: 1 }, 
                  768: { slidesPerView: 2 }, 
                  1024: { slidesPerView: 3 }, 
                }}
              >
                {products.length > 0 ? (
                  products.map((productItem) => {
                    const allSizesOutOfStock = productItem.unitPrize.every(priceItem => priceItem.stock === 0);

                    return (
                      <SwiperSlide key={productItem._id}>
                        <div className="flex flex-col bg-white rounded-xl h-[500px] border mx-3">
                          {allSizesOutOfStock ? (
                            <div className="relative">
                              <img className="w-full h-64 object-cover rounded-t-xl mb-4 opacity-50" src={`http://localhost:7684/uploads/${productItem.image}`} alt={productItem.productName} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-red-600 bg-white  rounded-md px-4 py-2">Out of Stock</span>
                              </div>
                            </div>
                          ) : (
                            <Link to={`/market/productDetail/${productItem._id}`}>
                              <img className="w-full h-64 rounded-t-xl object-cover mb-4 hover:opacity-50" src={`http://localhost:7684/uploads/${productItem.image}`} alt={productItem.productName} />
                            </Link>
                          )}
                        
                          <Link to={`/market/productDetail/${productItem._id}`} className={allSizesOutOfStock ? 'pointer-events-none' : ''}>
                            <h5 className="text-base font-semibold px-4 text-gray-900 ">{productItem.productName}</h5>
                          </Link>
                          <span className="text-base font-thin font-sans px-4 capitalize text-gray-500">{productItem.category}</span>
                          
                          <div className="flex flex-col py-4 px-4 mt-3">
                              {productItem.unitPrize.map((priceItem) => (
                                <span key={priceItem._id}>
                                  {priceItem.stock === 0 ? (
                                    <div className='flex justify-between text-sm items-center py-1'>
                                      <p className="font-sans capitalize">{priceItem.size}</p>
                                      <p className="font-medium text-red-600">Out of Stock</p>
                                    </div>
                                  ) : (
                                    <div className='flex justify-between text-sm items-center py-1'>
                                      <p className="capitalize">{priceItem.size}</p>
                                      <p className="font-semibold">₱{priceItem.price}</p>
                                    </div>
                                  )}
                                </span>
                              ))}
                            </div>
                        </div>
                      </SwiperSlide>
                    );
                  })
                ) : (
                  <p>No products available</p>
                )}
              </Swiper>

              <div className="custom-pagination flex justify-center mt-6 mb-20"></div>
            </div>
          </div>
        </div>
      <Footer />
     </div>
    </>
  );
};

export default Market;
