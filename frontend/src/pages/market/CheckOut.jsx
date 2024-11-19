import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography } from '@material-tailwind/react';

const CheckOut = () => {
    const location = useLocation();
    const { cartItems = [], total = 0 } = location.state || {};
    const navigate = useNavigate();
    const userId = Cookies.get('userId');

    const [shippingFee, setShippingFee] = useState(0);
    const [currentCartItems, setCurrentCartItems] = useState(cartItems);
    const [error, setError] = useState('');

    const initialAddressData = {
        name: '',
        phone: '',
        address: '',
        street: '',
        zipCode: '',
        shippingLocation: '',
        shippingFee: 0,
        isDefault: false
    };

    const [formAddressData, setFormAddressData] = useState(initialAddressData);
    const [addresses, setAddresses] = useState([]);
    const [selectedDefault, setSelectedDefault] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod')

      

   
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`http://localhost:7684/api/addresses/${userId}`);
                const fetchedAddresses = response.data;
                
                // Set the addresses in state
                setAddresses(fetchedAddresses);

                // Find and set the default address if available
                const defaultAddress = fetchedAddresses.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedDefault(defaultAddress._id);
                    setShippingFee(defaultAddress.shippingFee || 0);  // Set shipping fee based on default address
                } else {
                    setSelectedDefault(null); // No default address
                    setShippingFee(0);        // Reset shipping fee if no default address
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
            } finally {
                setLoading(false); // Stop loading after fetch
              }
        };

        useEffect(() => {
            fetchAddresses();
        }, [userId]);

    
      const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        // Calculate shipping fee if the location is changed
        const updatedData = {
            ...formAddressData,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'shippingLocation' && { shippingFee: getShippingFee(value) })
        };
    
        setFormAddressData(updatedData);
      };

      const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

      // Open modal for adding a new address
        const handleAddAddress = () => {
            setFormAddressData(initialAddressData); // Reset form data
            setIsEditMode(false);
            document.getElementById('my_modal_1').showModal();
        };

        // Open modal for editing an existing address
        const handleEditAddress = (address) => {
            setFormAddressData({
                name: address.name,
                phone: address.phone,
                address: address.address,
                street: address.street,
                zipCode: address.zipCode,
                shippingLocation: address.shippingLocation,
                isDefault: address.isDefault || false,
            });
            setEditingAddressId(address._id); // Store the ID of the address being edited
            setIsEditMode(true);
            document.getElementById('my_modal_1').showModal();
        };
    
        const handleAddressSubmit = async (e) => {
            e.preventDefault();
            try {
                if (isEditMode) {
                    // Submit an update request if in edit mode
                    await axios.put(`http://localhost:7684/api/addresses/${editingAddressId}`, formAddressData);
                    alert('Address updated successfully');
                } else {
                    // Otherwise, add a new address
                    await axios.post('http://localhost:7684/api/addresses', {
                        ...formAddressData,
                        userId, // Include user ID for new address
                    });
                    alert('Address added successfully');
                }
                fetchAddresses(); // Reload the address list
                document.getElementById('my_modal_1').close(); // Close modal
                setFormAddressData(initialAddressData); // Clear the form
            } catch (error) {
                console.error('Error submitting address:', error);
                alert('There was an error submitting the address');
            }finally {
                setLoading(false); // Stop loading after fetch
              }
        };

      const handleDefaultChange = async (addressId) => {
        try {
          await axios.patch('http://localhost:7684/api/addresses/default', {
            addressId,
            userId,
          });
          setSelectedDefault(addressId);
          const selectedAddress = addresses.find(address => address._id === addressId);
    
          if (selectedAddress) {
              setSelectedDefault(addressId); // Update the selected address
              setShippingFee(selectedAddress.shippingFee || 0); // Set the shipping fee based on the selected address
          }
          setAddresses(prevAddresses =>
            prevAddresses.map(addr => ({
              ...addr,
              isDefault: addr._id === addressId,
            }))
          );
        } catch (error) {
          console.error("Error updating default address:", error);
        }finally {
            setLoading(false); // Stop loading after fetch
          }
      };

      const handleDeleteAddress = async (addressId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this address?');
    
        if (isConfirmed) {
            try {
                // Make a request to delete the address
                await axios.delete(`http://localhost:7684/api/addresses/${addressId}`);
                
                // Remove the deleted address from the local state
                setAddresses(prevAddresses => prevAddresses.filter(address => address._id !== addressId));
                alert('Address deleted successfully');
            } catch (error) {
                console.error('Error deleting address:', error);
                alert('There was an error deleting the address');
            }finally {
                setLoading(false); // Stop loading after fetch
              }
        }
    };

    useEffect(() => {
        if (!currentCartItems || currentCartItems.length === 0) {
            navigate('/market/cart');
        }
    }, [currentCartItems, navigate]);



    const getShippingFee = (location) => {
        switch (location) {
            case 'Central Luzon':
            case 'Province of Bulacan':
            case 'Caloocan':
                return 80;
            case 'Malolos':
            case 'Apalit':
            case 'San Miguel':
                return 180;
            case 'Tarlac':
            case 'Bataan':
            case 'San Fernando':
                return 380;
            default:
                return 0;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (currentCartItems.length === 0) {
            setError('You cannot confirm your order with no items in the cart.');
            return;
        }
    
        if (!selectedDefault) {
            setError('You cannot confirm your order without selecting an address.');
            return;
        }
    
        const selectedAddress = addresses.find(address => address._id === selectedDefault);
    
        if (!selectedAddress) {
            setError('The selected address is not available.');
            return;
        }
    
        const orderItems = currentCartItems.map(item => ({
            productId: item.productId, 
            productName: item.productName,
            price: item.totalPrice,
            productQuantity: item.quantity || 1,
            size: item.size,
            image: item.image,
        }));
    
        const newOrder = {
            userId,
            name: selectedAddress.name,
            address: selectedAddress.address,
            contactNumber: selectedAddress.phone,
            shippingLocation: selectedAddress.shippingLocation,
            street: selectedAddress.street,
            zipCode: selectedAddress.zipCode,
            paymentMethod: "cod",
            items: orderItems,
            totalAmount: total + shippingFee,
            
            shippingFee,
            date: new Date().toISOString(),
        };
        
        try {
            // Create the order
            const response = await axios.post('http://localhost:7684/api/orders', newOrder, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 201) {
                // Remove items from the cart in the database
                await Promise.all(currentCartItems.map(item =>
                    axios.delete(`http://localhost:7684/api/cart/${userId}/${item._id}`)
                ));
    
                Swal.fire({
                    title: 'Purchase Successfully!',
                    text: 'Thank you for your purchase.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
    
                navigate('/market/allproducts');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            const errorMessage = error.response?.data?.message || 'There was an error submitting your order. Please try again.';
            setError(errorMessage);
        }finally {
            setLoading(false); // Stop loading after fetch
          }
    };
    

    
         

    return (
        <>
             <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-7xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Shipping Information Section */}
                        <div className="border shadow p-6 rounded col-span-1 lg:col-span-2 flex flex-col h-auto">
                            <h1 className="text-xl font-semibold">Shipping Information</h1>
                            <p className="text-xs mb-3">Fill the form below in order to send you the orders invoice.</p>
                            {error && <p className="text-red-500">{error}</p>}

                            <div className="flex items-center justify-between">
                                <h1 className="font-semibold">Saved Address</h1>
                                <button
                                    className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
                                    onClick={handleAddAddress}
                                >
                                    Add Address
                                </button>
                            </div>

                            {/* Form for Shipping Information */}
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <div key={address._id} onClick={() => handleDefaultChange(address._id)} className="p-4 border rounded-md shadow-sm">
                                            <label className="flex items-start space-x-3">
                                                <input
                                                    type="radio"
                                                    name="defaultAddress"
                                                    checked={selectedDefault === address._id}
                                                    onChange={() => handleDefaultChange(address._id)}
                                                    className="form-radio h-4 w-4 text-indigo-600"
                                                />
                                                <div className="text-gray-700 text-sm">
                                                    <strong className="block font-semibold">{address.name}</strong>
                                                    <p>{address.shippingLocation}, {address.zipCode}</p>
                                                    <p>{address.street}</p>
                                                    <p>{address.address}</p>
                                                    <p>#{address.phone}</p>
                                                    <button
                                                        className="text-blue-500 underline mr-2"
                                                        onClick={(e) => { e.preventDefault(); handleEditAddress(address); }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-btn text-red-500 underline"
                                                        onClick={(e) => { e.preventDefault(); handleDeleteAddress(address._id); }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <h2 className="font-semibold">Payment Method</h2>
                                    <label className="flex items-center space-x-3 mt-2 p-5 border rounded-lg shadow-sm">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={true}
                                            onChange={handlePaymentMethodChange}
                                            className="form-radio h-4 w-4 text-indigo-600"
                                        />
                                        <span className="text-gray-700 text-sm">Cash on Delivery</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>

                        {/* Order Summary Section */}
                        <div className="border shadow rounded text-gray-900 flex flex-col h-auto">
                            <h2 className="text-xl font-bold py-4 px-6">Order Summary</h2>
                            {currentCartItems.length > 0 ? (
                                <div>
                                    {currentCartItems.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center px-6 py-2">
                                            <div className="flex items-center">
                                                <img
                                                    src={`http://localhost:7684/uploads/${item.image}`}
                                                    alt={item.productName}
                                                    className="w-20 h-20 object-cover rounded-md mr-4"
                                                />
                                                <div>
                                                    <p className="font-bold">{item.productName}</p>
                                                    <p className="capitalize font-bold text-sm">{item.size}</p>
                                                    <p className="font-semibold text-sm">₱{item.totalPrice}</p>
                                                    <p className="text-sm">Qty: {item.quantity || 1}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                                    <div className='px-6'>
                                        <div className="my-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Typography className="font-normal">Subtotal</Typography>
                                                <Typography className="font-bold">₱{total}</Typography>
                                            </div>
                                        </div>
                                        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                                        <div className="my-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Typography className="font-normal">Shipping Fee</Typography>
                                                <Typography className="font-bold">₱{shippingFee}</Typography>
                                            </div>
                                        </div>
                                        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                                        <div className="my-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Typography className="font-normal">Total</Typography>
                                                <Typography className="font-bold">₱{total + shippingFee}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="px-6 py-4">No items in the cart.</p>
                            )}
                        </div>
                    </div>
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
                </div>
            </div>



        {/* Open the modal using document.getElementById('ID').showModal() method */}
       
        <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
            <div className="modal-action">
            <form onSubmit={handleAddressSubmit}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                        name="name"
                        required
                        type="text"
                        value={formAddressData.name}
                        onChange={handleAddressChange}
                        className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    </div>

                    <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                        Phone
                    </label>
                    <div className="mt-2">
                        <input
                        id="phone"
                        name="phone"
                        required
                        type="number"
                        value={formAddressData.phone}
                        onChange={handleAddressChange}
                        autoComplete="family-name"
                        className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="shippingLocation" className="block text-sm/6 font-medium text-gray-900">
                            City
                        </label>
                        <div className="mt-2">
                        <select
                        id="shippingLocation"
                        name="shippingLocation"
                        required
                        value={formAddressData.shippingLocation}
                        onChange={handleAddressChange}
                        autoComplete="country-name"
                        className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                        >
                        <option value="">Select Location</option>
                                <option value="Central Luzon">Central Luzon</option>
                                <option value="Province of Bulacan">Province of Bulacan</option>
                                <option value="Caloocan">Caloocan</option>
                                <option value="Malolos">Malolos</option>
                                <option value="Apalit">Apalit</option>
                                <option value="San Miguel">San Miguel</option>
                                <option value="Tarlac">Tarlac</option>
                                <option value="Bataan">Bataan</option>
                                <option value="San Fernando">San Fernando</option>
                        </select>
                    </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="street" className="block text-sm/6 font-medium text-gray-900">
                            Street
                        </label>
                        <div className="mt-2">
                            <input
                            id="street"
                            name="street"
                            required
                            type="text"
                            value={formAddressData.street}
                            onChange={handleAddressChange}
                            autoComplete="address-level1"
                            className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="zipCode" className="block text-sm/6 font-medium text-gray-900">
                            ZIP / Postal code
                        </label>
                        <div className="mt-2">
                            <input
                            id="zipCode"
                            name="zipCode"
                            required
                            type="text"
                            value={formAddressData.zipCode}
                            onChange={handleAddressChange}
                            autoComplete="postal-code"
                            className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                            Address
                        </label>
                        <div className="mt-2 mb-2">
                            <input
                            id="address"
                            name="address"
                            required
                            type="text"
                            value={formAddressData.address}
                            onChange={handleAddressChange}
                            className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="flex items-center mb-4 col-span-full">
                        <input 
                        name="isDefault" 
                        type="checkbox"
                        checked={formAddressData.isDefault}
                        onChange={handleAddressChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Set as default address</label>
                    </div>
                </div>
            
                <div className='flex justify-between items-center'>
                    <button className="btn" type='button' onClick={() => document.getElementById('my_modal_1').close()}>Close</button>
                    <button type='submit' className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{isEditMode ? 'Update Address' : 'Save Address'}</button>
                </div>
            </form>
            </div>
        </div>
        </dialog>
    </>
    );
};

export default CheckOut;
