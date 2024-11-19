import React, { useEffect, useState } from 'react'
import SingleBar from '../../../components/apexCharts/SingleBar'
import axios from 'axios';
import StockStatusBadge from '../../../components/StockStatusBadge';

const ProductTracking = () => {
    const [products, setProducts] = useState([]); // State for products
    const [loading, setLoading] = useState(true); // State for loading
    
    //Pagination
    const itemsPerPage = 2; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    const [launchedProducts, setLaunchedProducts] = useState({});
    const [lowStockItems, setLowStockItems] = useState([]);

    // Slice the products array for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    //Pageination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
      const fetchProducts = async () => {
          try {
              const response = await axios.get('http://localhost:7684/api/finishGoods');
              const allProducts = response.data;

              // Check for low or out-of-stock items
              const lowStockItems = allProducts.filter(product => 
                  product.unitPrize.some(size => size.status === 'lowonstock' || size.status === 'outofstock')
              );

              setProducts(allProducts);
              setLowStockItems(lowStockItems);
          } catch (error) {
              console.error('Error fetching products:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchProducts();
  }, []);

  useEffect(() => {
      // Trigger notification for low/out-of-stock items
      if (lowStockItems.length > 0) {
          alert(`Low Stock Alert: ${lowStockItems.length} product(s) need attention.`);
      }
  }, [lowStockItems]);
    


  return (
    <>

        <div className="p-4 rounded-lg ">
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                    <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-900">
                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        Home
                    </a>
                    </li>
                    <li>
                    <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900">Product Execution</a>
                    </div>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Product Tracking and Monitoring</span>
                    </div>
                    </li>
                </ol>
            </nav>
            <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">Product Tracking</h2>
            {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div class="flex items-center justify-center h-screen">
                  <div class="relative">
                      <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                      <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                      </div>
                  </div>
              </div>
            </div>
          )}
            <div className="flex flex-col bg-white">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="border rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                    <div className="py-3 px-4">
                      <div className="relative max-w-xs">
                        <label className="sr-only">Search</label>
                        <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Search for items"/>
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                          <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Id</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Image</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Name</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Category</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Size</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Stock Level</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Stock Status</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {currentProducts && currentProducts.length > 0 ? (
                            currentProducts.map((prod) => (
                          <tr key={prod._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{prod._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                              <img src={`http://localhost:7684/uploads${typeof prod.image === 'string' && prod.image.startsWith('/') ? '' : '/'}${prod.image}`} alt='' className="w-[100px] h-auto max-w-none object-cover rounded "/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{prod.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 capitalize">{prod.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                              {prod.unitPrize && prod.unitPrize.length > 0 ? (
                                  prod.unitPrize.map((priceObj) => (
                                      <p key={priceObj._id} className='py-2 capitalize'> 
                                          {priceObj.size}
                                      </p>
                                  ))
                              ) : (
                                  <p>N/A</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                              {prod.unitPrize && prod.unitPrize.length > 0 ? (
                                  prod.unitPrize.map((priceObj) => (
                                      <p key={priceObj._id} className='py-2 capitalize'> 
                                          {priceObj.stock}
                                      </p>
                                  ))
                              ) : (
                                  <p>N/A</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                              {prod.unitPrize && prod.unitPrize.length > 0 ? (
                                  prod.unitPrize.map((priceObj) => (
                                      <p key={priceObj._id} className='py-2 capitalize'> 
                                         <StockStatusBadge key={priceObj._id} status={priceObj.status} />
                                      </p>
                                  ))
                              ) : (
                                  <p>N/A</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{prod.location}</td>
                          </tr>
                          ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">No products available.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    <div className="py-1 px-4">
                        <nav className="flex items-center space-x-1" aria-label="Pagination">
                            <button 
                                type="button" 
                                className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" 
                                aria-label="Previous"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                <span aria-hidden="true">«</span>
                                <span className="sr-only">Previous</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`min-w-[30px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-1 text-sm rounded disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700 ${
                                        currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
                                    }`}
                                    onClick={() => setCurrentPage(index + 1)}
                                    aria-current={currentPage === index + 1 ? "page" : undefined}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button 
                                type="button" 
                                className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" 
                                aria-label="Next"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Next</span>
                                <span aria-hidden="true">»</span>
                            </button>
                        </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default ProductTracking