import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null); // New state for selected order

    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:7684/api/orders/${userId}`);
                setOrders(response.data.reverse())
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const openModal = (order) => {
        setSelectedOrder(order); // Set the selected order
        document.getElementById('my_modal_1').showModal();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const tabItems = [
        { label: 'All', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>},
        { label: 'To Ship', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
        { label: 'To Delivered', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" /></svg>},
        { label: 'Completed', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" /></svg>},

    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-8">

                <div className="sm:hidden">
                    <select
                        id="tabs"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={(e) => handleTabChange(e.target.value)}
                        value={activeTab}
                    >
                        {tabItems.map(({ label }) => (
                            <option key={label} value={label}>{label}</option>
                        ))}
                    </select>
                </div>

                <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex">
                    {tabItems.map(({ label, icon }) => (
                        <li className="w-full" key={label}>
                            <a
                                href="#"
                                className={`flex items-center justify-center w-full p-4 ${activeTab === label ? 'text-gray-900 bg-gray-100' : 'bg-white'} border-r border-gray-200 rounded-lg`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleTabChange(label);
                                }}
                                aria-current={activeTab === label ? 'page' : undefined}
                            >
                                <span className="flex items-center mr-2">
                                    {icon}
                                </span>
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="p-4">
                    {activeTab === 'All' && 
                        <div className='flex-grow'>
                            {orders.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {orders.map((order) => (
                                        <div className='border rounded-lg' key={order._id}>
                                            <div className='p-4'>
                                                <h2 className='text-lg font-bold flex'>
                                                    Your Order 
                                                    {/* Delivery Status */}
                                                    <p className={`text-sm font-medium mt-1 ml-2 ${order.status === 'Pending' ? 'text-orange-600' : order.status === 'Confirmed' ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {order.status === 'Pending' && '⏳'}
                                                        {order.status === 'Confirmed' && '✔'}
                                                        {order.status}
                                                    </p>
                                                </h2>
                                                <div className='flex mt-5 text-sm'>
                                                    <p className='font-bold'>Order Date:</p>
                                                    <p className='ml-1'>{order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Date not available'}</p>
                                                </div>
                                            </div>
                                            <hr className="h-px mb-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                            
                                            {/* Map through items in the order */}
                                            {order.items.map((item) => (
                                                <div className="p-4 shadow-sm flex" key={item.productId}>
                                                    {/* Image and Status Column */}
                                                    <div className="flex flex-col items-center mr-4">
                                                        {/* Product Image */}
                                                        <img src={`http://localhost:7684/uploads/${item.image}`} alt={item.productName} className="w-24 h-24 object-cover rounded-md"/>
                                                    </div>

                                                    {/* Product Details and Action Button Column */}
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">
                                                                    {item.productName}
                                                                </h3>
                                                                <p className="text-sm">Size: {item.size}</p>
                                                                <p className="text-sm">Qty - {item.productQuantity}</p>
                                                            </div>
                                                            {/* Price */}
                                                            <p className="text-lg font-semibold text-gray-700">
                                                                ₱{item.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Action Button for the whole order */}
                                            <div className=" my-4 flex justify-end">
                                                <button className="px-4 py-2 text-orange-600 rounded-md" onClick={() => openModal(order)}>
                                                    View Details
                                                </button>
                                                {order.status === 'Pending' && (
                                                    <button className="ml-2 px-4 py-2 text-orange-600 rounded-md" onClick={() => cancelOrder(order._id)}>
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>You have no orders yet.</p>
                            )}


                        </div>
                    }
                    {activeTab === 'To Ship' && <div>No Orders Yet.</div>}
                    {activeTab === 'To Delivered' && <div>No Orders Yet.</div>}
                    {activeTab === 'Completed' && <div>No Orders Yet.</div>}
                </div>

                {/* Modal for selected order */}
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box w-11/12 max-w-4xl p-6">
                    <h3 className="font-bold text-lg mb-10">Order Details</h3>
                        {selectedOrder ? (
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
                        ) : (
                            <p>No order selected</p>
                        )}
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn" onClick={() => setSelectedOrder(null)}>Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>

            </div>
            <Footer />
        </>
    );
}

export default Orders;
