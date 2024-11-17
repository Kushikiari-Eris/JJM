import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import jjm from '../assets/image/jjm.jpg'
import { useCartContext } from '../context/CartContext.jsx';

function Navbar() {
    const { loggedIn, role } = useContext(AuthContext);
    const { cartItemCount } = useCartContext();

    return (
        <>
            <div className="w-full p-5 bg-white text-black/70 h-[85px] rounded-l-sm sticky top-0 z-50 shadow-md">
                <div className="flex justify-between max-md:flex max-md:justify-end">
                        <a href="/market" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="flex flex-shrink-0 items-center">
                                {/* Conditional rendering of logo or text */}
                                {loggedIn && role === 'admin' ? (
                                    <span className=" text-lg font-extrabold leading-none  text-gray-900 md:text-1xl dark:text-gray-900">CORE 2 DEPARTMENT</span>
                                ) : (
                                    <img
                                        className="h-10 w-auto"
                                        src={jjm}
                                        alt="Your Company"
                                    />
                                )}
                            </div>
                        </a>
                    <div className="flex gap-5 items-center w-[600px] max-md:hidden">
                    {/* Sidebar toggle button */}


                    </div>
                    {/* Right-side icons and user profile */}
                    <div className="flex gap-3 items-center">
                    {/* Menu for non-logged-in users */}
                    {loggedIn === false && (
                        <>
                            <Link to="/login" className="btn btn-outline btn-accent">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-outline btn-accent">
                                Register
                            </Link>
                        </>
                    )}
                    
                    {/* Menu for logged-in admins */}
                    {loggedIn === true && role === 'admin' && (
                        <>
                            <Profile />
                        </>
                    )}


                    {loggedIn && role === 'auditor' && (
                        <>
                            <Profile />
                        </>
                    )}

                    {/* Menu for logged-in users */}
                    {loggedIn === true && role === 'user' && (
                        <>
                            <Link to="/market/cart" className="relative rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-green-400 hover:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="cart-icon size-6"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                                
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                    {cartItemCount}
                                    </span>
                                )}
                                </Link>
                            <Profile />
                        </>
                    )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;