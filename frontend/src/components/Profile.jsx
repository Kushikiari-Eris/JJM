import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { MdOutlineDarkMode } from 'react-icons/md';
import { IoMdNotificationsOutline } from 'react-icons/io';
import Cookies from 'js-cookie';
import axios from 'axios';
import ProfileModal from './ProfileModal'; // Import the ProfileModal

const Profile = () => {
  const { getLoggedIn } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });
  const [isModalOpen, setModalOpen] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState([]); // Store low stock notifications
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notifications dropdown

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:7684/api/loggedIn');
        const { loggedIn, role, user } = response.data;

        if (loggedIn) {
          setRole(role);
          setUserData(user); // Assuming user data is returned from the API
          Cookies.set('userRole', role, { expires: 7 });
        }
      } catch (error) {
        console.log('Error fetching user role:', error);
      }
    };

    const fetchLowStockAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:7684/api/finishGoods');
        setLowStockAlerts(response.data); 
      } catch (error) {
        console.log('Error fetching low stock alerts:', error);
      }
    };

    fetchUserRole();
    fetchLowStockAlerts();
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    await axios.get('http://localhost:7684/api/logout');
    const userId = Cookies.get('userId');
    if (userId) {
      const cartKey = `cart_${userId}`;
      localStorage.removeItem(cartKey);
    }
    Cookies.remove('userId');
    await getLoggedIn();
    navigate('/');
  };

  return (
    <>
      <div className="flex gap-3 items-center">
          <MdOutlineDarkMode className="size-6 cursor-pointer" />
          {/* Notifications Icon */}
          {role === 'admin' && (
            <div className="relative">
              <IoMdNotificationsOutline
                className="size-6 cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {lowStockAlerts.length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-600 rounded-full animate-bounce">
                  {lowStockAlerts.length}
                </span>
                
              )}
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 w-64 mt-2 bg-white border rounded-lg shadow-lg">
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-700">Low Stock Alerts</h3>
                    <ul className="mt-2">
                      {lowStockAlerts.map((alert, index) => {
                        const filteredUnitPrize = alert.unitPrize?.filter(
                          (priceObj) => priceObj.status === 'LowOnStock' || priceObj.status === 'OutOfStock'
                        );

                        // Skip products with no low or out-of-stock items
                        if (!filteredUnitPrize || filteredUnitPrize.length === 0) return null;

                        return (
                          <li key={index} className="p-2 border-b last:border-none">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">{alert.productName}</span>
                              {filteredUnitPrize.map((priceObj) => (
                                <p key={priceObj._id} className="py-2 capitalize">
                                  ({priceObj.size}) -{' '}
                                  <span className="text-red-500">{priceObj.stock} left</span>
                                </p>
                              ))}
                            </p>
                          </li>
                        );
                      })}
                      {lowStockAlerts.length === 0 && (
                        <li className="p-2 text-center text-gray-500">No alerts</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {role === 'auditor' && (
            <div className="relative">
              <IoMdNotificationsOutline
                className="size-6 cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              />
            
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <img
              src="https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg"
              tabIndex={0}
              role="button"
              alt="/"
              className="size-10 rounded-full"
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 mt-2 shadow"
            >
              <li>
                <a onClick={() => setModalOpen(true)}>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              {role === 'user' && (
                <li>
                  <Link to="/market/orders">Orders</Link>
                </li>
              )}
              <li>
                <a onClick={logout}>Log out</a>
              </li>
            </ul>
          </div>
        </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userData={userData}
      />
    </>
  );
};

export default Profile;
