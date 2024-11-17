import { Card, CardBody, Typography } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import StockStatusBadge from '../../../../components/StockStatusBadge';

const Finish = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('soap');
  const [location, setLocation] = useState('');
  const [unitPrize, setUnitPrize] = useState([
    { size: 'small', price: '', stock: '' },
    { size: 'medium', price: '', stock: '' },
    { size: 'large', price: '', stock: '' },
  ]);
  const [imageFile, setImage] = useState(null);
  const [products, setProducts] = useState([]); // State for products
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product for modal
  const [isEditMode, setIsEditMode] = useState(false);

 
  //Pagination
  
  const itemsPerPage = 3; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Slice the products array for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  //Pagination
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

  

  // Function to fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:7684/api/finishGoods');
      setProducts(response.data);
      return response.data; 
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when the component mounts
  }, []); // Empty dependency array to run only once on component mount

  const handleUnitPrizeChange = (index, e) => {
    const newUnitPrize = [...unitPrize];
    newUnitPrize[index][e.target.name] = e.target.value;
    setUnitPrize(newUnitPrize);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming unitPrize state looks like this
    const unitPrices = unitPrize.map((item) => ({
        size: item.size,
        price: item.price,
        stock: item.stock
    }));

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('unitPrices', JSON.stringify(unitPrices)); // Send updated unitPrices

    if (imageFile) {
      formData.append('image', imageFile); // Append the image from state
    }
  
    try {
        if (isEditMode) {
            // If in edit mode, make a PUT request
            const response = await axios.put(`http://localhost:7684/api/finishGoods/${selectedProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product updated successfully!');
        } else {
            // If in add mode, make a POST request
            const response = await axios.post('http://localhost:7684/api/finishGoods', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product added successfully!');
        }

        document.getElementById('my_modal_1').close();
        fetchProducts(); // Re-fetch products after adding/updating a product
    } catch (error) {
      toast.erro('Error adding/updating product:', error.response ? error.response.data : error.message);
    }
};

  

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    document.getElementById('detail_modal').showModal();
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.productName);
    setDescription(product.description);
    setCategory(product.category);
    setLocation(product.location);
    setUnitPrize(product.unitPrize);
    setIsEditMode(true); // Set edit mode to true
    document.getElementById('my_modal_1').showModal();
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    document.getElementById('detail_modal').close();
  };

  // Function to handle deletion of a product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?'); // Confirmation dialog
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:7684/api/finishGoods/${productId}`); // Delete request
        toast.success('Product deleted successfully!');
         // Fetch the updated list of raw materials
         const updatedProducts = await fetchProducts(); // Fetch updated list
         const totalItems = updatedProducts.length; // Use updated list length

         // Handle pagination logic
         const itemsPerPage = 3; // Assuming you have this constant defined
         const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

         // If current page exceeds total pages, reset to the last valid page
         if (currentPage > totalPages && totalItems > 0) {
             setCurrentPage(totalPages); // Set to last page if it's within limits
         } else if (currentPage === totalPages && totalItems === 0) {
             setCurrentPage(1); // Reset to page 1 if the last item on the current page was deleted
         } // Re-fetch products after deletion
      } catch (error) {
        toast.error('Error deleting product: ' + (error.response ? error.response.data : error.message));
      }
    }
  };


  return (
    <>

      <div className="p-4 rounded-lg dark:border-gray-700 ">
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
              <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900">Inventory</a>
          </div>
          </li>
          <li>
          <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900">Stocks</a>
          </div>
          </li>
          <li aria-current="page">
          <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Finish Goods</span>
          </div>
          </li>
      </ol>
      </nav>
      <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">Finish Goods</h2>
      
 
        


        <div className="flex flex-col bg-white">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="border rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                    <div className='flex justify-between py-3 px-4'>
                    <div className="py-1 px-4">
                      <div className="relative max-w-xs flex justify-between">
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
                    <button className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-10 py-2 text-center  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => { 
                          setIsEditMode(false); // Reset to add mode
                          setProductName('');
                          setDescription('');
                          setCategory('soap');
                          setLocation('');
                          setUnitPrize([
                            { size: 'small', price: '', stock: '' },
                            { size: 'medium', price: '', stock: '' },
                            { size: 'large', price: '', stock: '' },
                          ]);
                          setImage(null);
                          document.getElementById('my_modal_1').showModal(); 
                        }}>
                          Add Product
                        </button>
                    </div>
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Id</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Name</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Category</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Location</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Actiion</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {currentProducts.map((product, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{product._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{product.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 capitalize">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{product.location}</td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                              <button className="text-blue-600 hover:text-blue-300 dark:text-blue-500 dark:hover:text-blue-400 mr-2" onClick={() => openDetailModal(product)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              </button>
                              <button className="text-green-600 hover:text-green-300 dark:text-green-500 dark:hover:text-green-400 mr-2" onClick={() => openEditModal(product)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                              </button>
                              <button className="text-red-600 hover:text-red-300 dark:text-red-500 dark:hover:text-red-400" onClick={() => handleDelete(product._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                          ))}
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

      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className=" mx-auto py-10 px-8 border bg-white max-h-[90vh] overflow-auto rounded relative" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="py-4">
            <input type="text" className="input input-bordered w-full" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <textarea type="text" className="input input-bordered w-full mt-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" className="input input-bordered w-full mt-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <select className="select select-bordered w-full mt-2" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="soap">Soap</option>
              <option value="detergent">Detergent</option>
            </select>
            <h4 className="mt-4">Unit Prices</h4>
            {unitPrize.map((unit, index) => (
              <div key={index} className="flex space-x-2 mt-2">
                <input type="text" className="input input-bordered" name="size" placeholder="Size" value={unit.size} readOnly />
                <input type="text" className="input input-bordered" name="price" placeholder="Price" value={unit.price} onChange={(e) => handleUnitPrizeChange(index, e)} />
                <input type="text" className="input input-bordered" name="stock" placeholder="Stock" value={unit.stock} onChange={(e) => handleUnitPrizeChange(index, e)} />
              </div>
            ))}
            <input type="file" className="file-input file-input-bordered w-full mt-4" onChange={handleImageChange} />
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
            <button type="submit" className="btn">{isEditMode ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </dialog>

      {/* Detail Modal for displaying unit price details */}
      <dialog id="detail_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Product Details</h3>
          {selectedProduct ? (
            <div className="py-4">
              {/* Displaying the Product Image */}
              {selectedProduct.image && (
                <img 
                  src={`http://localhost:7684/uploads/${selectedProduct.image}`} // Update with your image path
                  alt={selectedProduct.productName}
                  className="w-full h-auto mt-4 rounded-md"
                />
              )}
              <p className='mt-4'><strong>Product Name:</strong> {selectedProduct.productName}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Location:</strong> {selectedProduct.location}</p>

              <h4 className="mt-4">Unit Price:</h4>
              <ul>
                {selectedProduct.unitPrize && selectedProduct.unitPrize.length > 0 ? (
                  selectedProduct.unitPrize.map((unit, index) => (
                    <li key={index}>
                      Size: {unit.size}, Unit Price: {unit.price}, Stocks: {unit.stock}
                    </li>
                  ))
                ) : (
                  <p>No unit prices available.</p>
                )}
              </ul>
            </div>
          ) : (
            <p>No product selected.</p>
          )}
          <div className="modal-action">
            <button type="button" className="btn" onClick={closeDetailModal}>Close</button>
          </div>
        </form>
      </dialog>

    <ToastContainer />
  </>
  );
};

export default Finish;
