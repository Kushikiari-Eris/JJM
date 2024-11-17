import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const Raw = () => {
  // State to handle form inputs
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('soap'); // Default category
  const [location, setLocation] = useState('');
  const [sizes, setSizes] = useState([
    { size: 'small', stock: '' },
    { size: 'medium', stock: '' },
    { size: 'large', stock: '' },
  ]); // Array to handle sizes and stock
  const [image, setImage] = useState(null); // State to handle the image file
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const handleMaterialChange = (e) => {
    setSelectedMaterial(e.target.value);
    setSelectedSize(""); // Reset size when material changes
  };

  const handlesSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      materialId: selectedMaterial,
      size: selectedSize,
      quantity: parseInt(quantity, 10),
      notes,
    });
  };

  //Pagination
  
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(rawMaterials.length / itemsPerPage);

  // Slice the products array for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = rawMaterials.slice(startIndex, startIndex + itemsPerPage);

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected image file
  };

  // Handle change for size and stock inputs
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:7684/api/rawMaterial');
        setRawMaterials(response.data); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch raw materials');
        return []; // Return an empty array on error
    }
};


  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission for adding and updating
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!productName || !location || sizes.some(s => !s.size || s.stock === undefined || s.stock === '')) {
      toast.error('Please fill out all fields');
      return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('sizes', JSON.stringify(sizes)); // Ensure sizes is a JSON string

    if (image) {
        formData.append('image', image);
    }

    try {
        if (selectedProduct) {
            // Updating existing raw material
            const response = await axios.put(`http://localhost:7684/api/rawMaterial/${selectedProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Raw material updated successfully!');
        } else {
            // Adding new raw material
            const response = await axios.post('http://localhost:7684/api/rawMaterial', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Add Response:', response.data); // Debugging log
            toast.success('Raw material added successfully!');
        }

        resetForm();
        fetchData(); // Refresh the data
    } catch (error) {
        console.error('Error adding/updating raw material:', error.response ? error.response.data : error.message);
        toast.error('Failed to add/update raw material');
    }
};


  const resetForm = () => {
    setProductName('');
    setCategory('soap');
    setLocation('');
    setSizes([
      { size: 'small', stock: '' },
      { size: 'medium', stock: '' },
      { size: 'large', stock: '' },
    ]);
    setImage(null);
    setSelectedProduct(null); // Reset selected product after submission
    document.getElementById('my_modal_1').close(); // Close the modal
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.productName);
    setCategory(product.category);
    setLocation(product.location);
    setSizes(product.sizes);
    document.getElementById('my_modal_1').showModal();
  };

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    document.getElementById('detail_modal').showModal();
  };

  const openAddModal = () => {
    resetForm(); // Reset form fields to ensure they are empty for a new product
    document.getElementById('my_modal_1').showModal();
  };


  const closeDetailModal = () => {
    setSelectedProduct(null);
    document.getElementById('detail_modal').close();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?'); // Confirmation dialog
    if (confirmDelete) {
        try {
            await axios.delete(`http://localhost:7684/api/rawMaterial/${id}`);
            toast.success('Raw material deleted successfully!');

            // Fetch the updated list of raw materials
            const updatedProducts = await fetchData(); // Fetch updated list
            const totalItems = updatedProducts.length; // Use updated list length

            // Handle pagination logic
            const itemsPerPage = 5; // Assuming you have this constant defined
            const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

            // If current page exceeds total pages, reset to the last valid page
            if (currentPage > totalPages && totalItems > 0) {
                setCurrentPage(totalPages); // Set to last page if it's within limits
            } else if (currentPage === totalPages && totalItems === 0) {
                setCurrentPage(1); // Reset to page 1 if the last item on the current page was deleted
            }
        } catch (error) {
            console.error('Error deleting raw material:', error);
            toast.error('Failed to delete raw material');
        }
    }
};



  return (
    <>

      <div className="p-4 rounded-lg dark:border-gray-700">
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
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Raw Material</span>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">Raw Materials</h2>

        <div className="relative flex-grow">
          <div className="relative sm:rounded-lg flex items-center justify-between">
            <input type="text" id="table-search" className="block pt-4 ps-10 pb-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
            <button className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-10 py-2 text-center ml-4 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={openAddModal}>
              Add Product
            </button>
          </div>
        </div>

        <dialog id="my_modal_1" className="modal">
          <form method="dialog" className="mx-auto py-10 px-8 border bg-white max-h-[90vh] overflow-auto rounded relative" onSubmit={handleSubmit}>
            <h3 className="font-bold text-lg">{selectedProduct ? 'Edit Raw Material' : 'Add Raw Material'}</h3>
            <div className="py-4">
              <input type="text" className="input input-bordered w-full" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
              <input type="text" className="input input-bordered w-full mt-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <select className="select select-bordered w-full mt-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="soap">Soap</option>
                <option value="detergent">Detergent</option>
              </select>
              <h4 className="mt-4">Stocks</h4>
              {sizes.map((size, index) => (
                <div className="flex space-x-2 mt-2" key={index}>
                  <input type="text" className="input input-bordered" name="size" value={size.size} readOnly />
                  <input type="number" className="input input-bordered" name="stock" placeholder="Stock" value={size.stock} onChange={(e) => handleSizeChange(index, 'stock', e.target.value)} />
                </div>
              ))}
              <input type="file" className="file-input file-input-bordered w-full mt-4" onChange={handleImageChange} />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
              <button type="submit" className="btn">{selectedProduct ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </dialog>

        
        <div className="overflow-x-auto relative mt-4 rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product.productName}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.location}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-300 mr-2" onClick={() => openDetailModal(product)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    <button className="text-green-600 hover:text-green-300 dark:text-red-500 dark:hover:text-red-400" onClick={() => openEditModal(product)}>
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
          {/* Pagination Controls */}
          {totalPages > 1 && (
          <nav className="flex px-6 py-2 justify-center items-center gap-x-1 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" aria-label="Pagination">
              <button type="button" onClick={handlePreviousPage} disabled={currentPage === 1} className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10" aria-label="Previous">
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                <span aria-hidden="true" className="hidden sm:block">Previous</span>
              </button>
              
              <div className="flex items-center gap-x-1">
                {/* Display Previous Page */}
                <button type="button" className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${currentPage === 1 ? 'bg-gray-400' : 'bg-gray-200'} text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500`} disabled>
                  {currentPage > 1 ? currentPage - 1 : 1}
                </button>
                
                {/* Display Next Page */}
                <button type="button" className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${currentPage < totalPages ? 'bg-gray-200' : 'bg-gray-400'} text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500`} disabled>
                  {currentPage < totalPages ? currentPage + 1 : totalPages}
                </button>
              </div>
              
              <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages} className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                <span aria-hidden="true" className="hidden sm:block">Next</span>
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </nav>
          )}
        </div>

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
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Name</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Category</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Location</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {currentProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{product.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{product.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        <button className="text-blue-600 hover:text-blue-300 mr-2" onClick={() => openDetailModal(product)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </button>
                          <button className="text-green-600 hover:text-green-300 dark:text-red-500 dark:hover:text-red-400" onClick={() => openEditModal(product)}>
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
                    <button type="button" className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                      <span className="sr-only">Previous</span>
                    </button>
                    <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700" aria-current="page">1</button>
                    <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700">2</button>
                    <button type="button" className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700">3</button>
                    <button type="button" className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-label="Next">
                      <span className="sr-only">Next</span>
                      <span aria-hidden="true">»</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

      <dialog id="detail_modal" className="modal">
        {selectedProduct && (
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Product Details</h3>
            <div className="py-4">
              <img src={`http://localhost:7684/uploads/${selectedProduct.image}`} alt={selectedProduct.productName} className="w-full h-auto mt-4 rounded-md" />
              <p className='mt-4'><strong>Product Name:</strong> {selectedProduct.productName}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Location:</strong> {selectedProduct.location}</p>

              <h4 className="mt-4">Unit Prices</h4>
              <ul>
                {selectedProduct.sizes.map((sizeObj) => (
                  <li key={sizeObj._id}>
                    <strong>Size:</strong> {sizeObj.size}, <strong>Stock:</strong> {sizeObj.stock}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={closeDetailModal}>Close</button>
            </div>
          </form>
        )}
      </dialog>

    <hr className="h-px my-20 bg-gray-300 border-0 dark:bg-gray-700"></hr>

    <div className="grid  place-items-start">
      <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
        <h1 className="text-xl font-semibold">Request to Stock Replenishment</h1>
        <form className="mt-6" onSubmit={handlesSubmit}>
          <div className="flex justify-between gap-3">
            <span className="w-1/2">
              <label className="block text-xs font-semibold text-gray-600 uppercase">Product Name</label>
              <select value={selectedMaterial} onChange={handleMaterialChange} className='block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner'>
                <option value="">Select Material</option>
                {rawMaterials.length > 0 && rawMaterials.map((material) => (
                  <option key={material._id} value={material.productName}>
                    {material.productName}
                  </option>
                ))}
              </select>
            </span>
            <span className="w-1/2">
              <label  className="block text-xs font-semibold text-gray-600 uppercase">Size</label>
              <select className='block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner'
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={!selectedMaterial}
              >
                <option value="">Select Size</option>
                {selectedMaterial &&
                  rawMaterials
                    .find((material) => material.productName === selectedMaterial)
                    ?.sizes.map((size) => (
                      <option key={size._id} value={size.size}>
                        {size.size} - Available: {size.stock}
                      </option>
                    ))
                }
              </select>
            </span>
          </div>
          <label className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Quantity</label>
          <input className='block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner'
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
          <label  className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Notes</label>
          <textarea className='block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional information (optional)"
          />
          <button  className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
            Send Request
          </button>
        </form>
      </div>
    </div>

      </div>

    <ToastContainer />
    </>
  );
};

export default Raw;
