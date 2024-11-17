import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Step,
    Card,
    Stepper,
    CardBody,
    CardHeader,
    Typography,
  } from "@material-tailwind/react";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTruck, faGift } from '@fortawesome/free-solid-svg-icons';
import OrderStatusClasses from '../../../components/OrderStatusBadge'
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

  

const ProductOrders = () => {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // Hold selected order for modal
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [activeStep, setActiveStep] = React.useState(0);

    //Pagination
  
      const itemsPerPage = 5; // Number of items per page
      const [currentPage, setCurrentPage] = useState(1);

      // Calculate the total number of pages
      const totalPages = Math.ceil(orders.length / itemsPerPage);

      // Slice the products array for the current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentProducts = orders.slice(startIndex, startIndex + itemsPerPage);

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
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7684/api/orders');
                const fetchedOrders = response.data;
                setOrders(fetchedOrders.reverse());
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);
    
    

    const confirmOrder = async (orderId) => {
        setLoading(true);
        try {
            const response = await axios.patch(`http://localhost:7684/api/orders/${orderId}`);
              toast.success(response.data.message || 'Order updated successfully');
    
            const updatedOrder = response.data.order;
            if (updatedOrder) {
                // Update the order status in the list without fetching all orders again
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: updatedOrder.status } : order
                    )
                );
            } else {
                toast.error('No order found in the response');
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error confirming order');
        } finally {
            setLoading(false);
        }
    };
    
    
    
      

    // Open modal and set selected order
    const openModal = (order) => {
        setSelectedOrder(order);
        document.getElementById('shipment_modal').showModal(); // Open modal
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error state
    }

  return (
    <>

                <div className="p-4 rounded-lg">
                    {/* Breadcrumb Navigation */}
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-900">
                                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900">E-Commerce</a>
                                </div>
                            </li>
                            <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Orders</span>
                            </div>
                            </li>
                        </ol>
                    </nav>
                    <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">Customer Orders</h2>

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
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Order Id</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Customer Name</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Payment Method</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Total Ammount</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Order Status</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                {currentProducts && currentProducts.length > 0 ? (
                                  currentProducts.map((order, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{order._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{order.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">₱{order.totalAmount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200"><OrderStatusClasses OrderStatus={order.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                      <button className="text-blue-600 hover:text-blue-300 dark:text-blue-500 dark:hover:text-blue-400 mr-2" onClick={() => openModal(order)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                  ))
                                  ) : (
                                      <tr>
                                          <td colSpan="6" className="px-6 py-4 text-center">No orders found.</td>
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

                    {/* Modal for Order Details and Shipment Progress */}
                    <dialog id="shipment_modal" className="modal">

                    {selectedOrder && selectedOrder._id && (
                         <section className=" container mx-auto py-10 px-8 border bg-white max-h-[90vh] overflow-auto rounded relative">
                      <form method="dialog">
                                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                              </form>
                      <Typography variant="h4">Order Details</Typography>
                        <Typography className="text-gray-600 font-normal">
                          Order placed on <span className="font-bold">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                        </Typography>
                          <div className="mt-8 grid lg:gap-x-6 gap-y-6 lg:grid-cols-12 grid-cols-6">
                          
                            <div className="col-span-8 space-y-6">
                              
                              <Card className="border border-gray-300 !rounded-md shadow-sm ">
                                <CardBody className="p-4 flex gap-4 flex-col md:flex-row items-center justify-between">
                                  <div className="flex !justify-between w-full">
                                    <div>
                                      <Typography color="blue-gray" className="!font-semibold">
                                        Date Ordered
                                      </Typography>
                                      <Typography className="text-gray-600 font-normal">
                                      {new Date(selectedOrder.orderDate).toLocaleDateString()}
                                      </Typography>
                                    </div>
                                    <div>
                                      <Typography color="blue-gray" className="!font-semibold">
                                        Order Id
                                      </Typography>
                                      <Typography className="text-gray-600 font-normal">
                                      # {selectedOrder._id}
                                      </Typography>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                              <Card className="border border-gray-300 !rounded-md shadow-sm">
                                <CardBody className="md:px-2">
                                  {selectedOrder.items.map((item, index) => (
                                      <div key={index} className="grid grid-cols-5 items-center gap-1  ml-3">
                                          <img
                                              src={`http://localhost:7684/uploads/${item.image}`}
                                              className=" w-40 h-40 object-cover rounded row-span-1"
                                          />
                                          <div className="col-span-3 ml-3">
                                              <Typography variant="h6" color="blue-gray" className="text-base mb-1">
                                                  {item.productName}
                                              </Typography>
                                              <Typography className="font-normal text-gray-600 mb-0.5">
                                                  Size: {item.size}
                                              </Typography>
                                              <Typography className="font-normal text-gray-600 mb-0.5">
                                                  Quantity: {item.productQuantity}
                                              </Typography>
                                              <Typography className="font-normal text-gray-600 mb-0.5">
                                                  Price: ₱{item.price}
                                              </Typography>
                                          </div>
                                      </div>
                                  ))}
                            
                                </CardBody>
                              </Card>
                            </div>
                            <div className="lg:col-span-4 col-span-full space-y-6">
                              <Card className="border border-gray-300 !rounded-md shadow-sm">
                                <CardBody className="p-4">
                                  <Typography color="blue-gray" className="!font-semibold">
                                    Order Summary
                                  </Typography>
                                  {selectedOrder.items.map((item, index) => (
                                    <div className="my-4 space-y-2" key={index}>
                                          <div className="flex items-center justify-between">
                                              <Typography className="text-gray-600 font-normal">
                                                  {item.productName}
                                              </Typography>
                                              <Typography className="text-gray-600 font-normal">
                                                  {item.price}
                                              </Typography>
                                          </div>
                                      </div>
                                    ))}

                                    {/* Display Total Price */}
                                    <div className="my-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Typography className="text-gray-600">
                                                Subtotal
                                            </Typography>
                                            <Typography className="text-gray-600">
                                                {selectedOrder.items.reduce((acc, item) => acc + item.price, 0)}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="my-4 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Typography className="text-gray-600 font-normal">
                                          Shipping Fee
                                        </Typography>
                                        <Typography className="text-gray-600 font-normal">
                                          {selectedOrder.shippingFee}
                                        </Typography>
                                      </div>
                                    </div>
                                  <div className="flex items-center justify-between border-t border-gray-300 pt-4">
                                    <Typography color="blue-gray" className="!font-semibold">
                                      Total
                                    </Typography>
                                    <Typography color="blue-gray" className="!font-semibold">
                                      {selectedOrder.totalAmount}
                                    </Typography>
                                  </div>
                                </CardBody>
                              </Card>
                              <Card className="border border-gray-300 !rounded-md shadow-sm">
                                <CardBody className="p-4">
                                  <div className="flex items-center justify-between">
                                    <Typography color="blue-gray" className="!font-semibold">
                                      Shipping Address
                                    </Typography>
                                  </div>
                                  <div className="space-y-2 mt-4">
                                    <Typography className="text-gray-600 font-normal">
                                      Name: {selectedOrder.customerName}
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                      City: {selectedOrder.shippingLocation}
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                      Street: {selectedOrder.street}
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                      ZipCode: {selectedOrder.zipCode}
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                      Address: {selectedOrder.address}
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                      Contact No.: {selectedOrder.contactNumber}
                                    </Typography>
                                  </div>
                                </CardBody>
                              </Card>
                              {selectedOrder.status === 'Pending' && (
                                <button
                                  type="submit"
                                  onClick={() => confirmOrder(selectedOrder._id)}
                                  className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded w-full"
                                >
                                  {loading ? 'Confirming...' : 'Confirm Order'}
                                </button>
                              )}

                              {selectedOrder.status === 'Confirmed' && (
                                <button
                                  type="submit"
                                  onClick={() => sendToFinance(selectedOrder._id)}
                                  className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded w-full"
                                >
                                  Send to Finance
                                </button>
                              )}
                            </div>
                          </div>
                      </section>
                        )}
                    </dialog>
                </div>
   
            <ToastContainer/>
    </>
  )
}

export default ProductOrders