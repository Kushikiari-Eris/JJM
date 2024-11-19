import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartContext } from '../../context/CartContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const { resetCart } = useCartContext()

    useEffect(() => {
        if (userId) {
            fetchCartItems();
            resetCart();
        }
    }, [userId]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:7684/api/cart/${userId}`);
            if (response.status === 200) {
                setCartItems(response.data);
            } else {
                console.error('Failed to fetch cart items');
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false); // Stop loading after fetch
          }
    };
    

    const calculateTotal = () => {
        return selectedItems.reduce((total, index) => {
            const item = cartItems[index];
            return total + item.totalPrice; // Use totalPrice from cart items
        }, 0);
    };

    const handleCheckout = () => {
        const total = calculateTotal();
        const selectedProducts = selectedItems.map(index => cartItems[index]);
        navigate('/market/checkout', { state: { cartItems: selectedProducts, total } });
    };

    const handleCheckboxChange = (index) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter(i => i !== index); // Uncheck
            }
            return [...prevSelected, index]; // Check
        });
    };

    const handleRemoveItem = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:7684/api/cart/${userId}/${productId}`);
            console.log('Remove item response:', response.data);
            setCartItems(cartItems.filter(item => item._id !== productId));
        } catch (error) {
            console.error('Error removing item:', error.response ? error.response.data : error);
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
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
            <div className="min-h-screen p-8 flex-grow py-16 px-8">
                <div className="text-gray-900 p-6">
                    <h2 className="text-3xl font-bold mb-6">My Cart</h2>
                    {cartItems.length > 0 ? (
                    <div>
                        {cartItems.map((item, index) => (
                        <div key={item._id} className="flex flex-col sm:flex-row justify-between items-center mb-4 border p-5 rounded-lg">
                            <div className="flex items-start sm:items-center w-full sm:w-auto">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(index)}
                                onChange={() => handleCheckboxChange(index)}
                                className="mr-2"
                            />
                            <img src={`http://localhost:7684/uploads/${item.image}`} alt={item.productName} className="w-20 h-20 object-cover rounded-md mr-4" />
                            <div>
                                <p className="text-sm sm:text-base">{item.productName}</p>
                                <p className="text-xs sm:text-sm">Size: {item.size}</p>
                                <p className="text-xs sm:text-sm">Quantity: {item.quantity || 1}</p>
                                <p className="text-xs sm:text-sm">Price: ₱{item.totalPrice}</p>
                            </div>
                            </div>
                            <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded mt-2 sm:mt-0"
                            >
                            Remove
                            </button>
                        </div>
                        ))}
                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                        <div className="flex flex-col sm:flex-row justify-between font-bold">
                        <div>
                            <p>Order Total: ₱{calculateTotal() || 0}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={selectedItems.length === 0}
                            className={`bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Proceed to Checkout
                        </button>
                        </div>
                    </div>
                    ) : (
                    <p>No items in the cart.</p>
                    )}
                </div>
                </div>

            <Footer />
        </div>
    );
};

export default Cart;