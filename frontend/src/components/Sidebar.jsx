import { useContext, useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import jjm from '../assets/image/jjm.jpg';
import AuthContext from "../context/AuthContext";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { MdOutlineScreenshotMonitor } from "react-icons/md";

const Sidebar = () => {

    const { role } = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };


   

    return (
        <div className={`flex flex-col h-screen bg-white text-black py-4 border-r-2 sticky top-0 max-md:hidden transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-72 lg:w-80"
          }`}
          aria-label="Sidebar">
             {/* Toggle Button */}
            <div className="flex justify-e">
                <button
                    onClick={toggleSidebar}
                    className={`mb-4 p-1 text-black border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200  ${
                    isCollapsed ? "w-11" : "w-11 "
                    }`}
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? "▶" : "◀"}
                </button>
            </div>
            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer mb-8 justify-center"
                aria-label="Dashboard Logo"
            >
                <img src={jjm} alt="Logo" className="w-40 h-40" />
                {!isCollapsed}
            </div>

       
            <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-white ">
                

                {/* Admin Section */}
                {role === 'admin' && (
                <ul className="space-y-2 font-medium">
                    {!isCollapsed &&<h2 className="font-semibold text-neutral-800 text-sm py-3">MENU</h2>}
                    <li>
                        <NavLink 
                            to="/admin/dashboard" 
                            className={({ isActive }) => `font-bold flex items-center p-2 py-3 text-slate rounded-lg dark:text-white ${isActive ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                            </svg>

                            {!isCollapsed &&<span className="ms-3 text-sm">Dashboard</span>}
                        </NavLink>
                    </li>

                    

                    {!isCollapsed && <h2 className="font-bold text-neutral-800 font-sans text-sm py-3">PRODUCT EXECUTION</h2>}

                    <li>
                        <ul>
                            <NavLink to="/admin/productTracking" className={({ isActive }) => `font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg  group hover:bg-gray-100  dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>

                            {!isCollapsed && <span className="ms-3 text-sm">Product Tracking</span>}
                            </NavLink>
                        </ul>
                        <ul>
                            <NavLink to="/admin/product" className={({ isActive }) => `font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>

                            {!isCollapsed &&<span className="ms-3 text-sm">Product Launcher</span>}
                            </NavLink>
                        </ul>
                        
                        <ul>
                        <Disclosure>
                                <DisclosureButton className="font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                    </svg>

                                    {!isCollapsed &&<span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-sm">Customer</span>}
                                    {!isCollapsed &&<span className="ml-6 flex items-center">
                                        <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                        <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                    </span>}
                                </DisclosureButton>
                                <DisclosurePanel>
                                <li>
                                    <NavLink to="/admin/orders" className={({ isActive }) => `font-bold py-3 flex items-center w-full p-2 text-slate transition duration-75 rounded-lg group pl-6 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>

                                    {!isCollapsed &&<span className="ms-3 text-sm">Orders</span>}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/users" className={({ isActive }) => `font-bold py-3 flex items-center w-full p-2 text-slate transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                    </svg>

                                    {!isCollapsed &&<span className="ms-3 text-sm">Users</span>}
                                    </NavLink>
                                </li>
                            </DisclosurePanel>
                           </Disclosure>
                        </ul>
                    </li> 

                    {!isCollapsed && <h2 className="font-bold text-neutral-800 font-sans text-sm py-3">INVENTORY</h2>}
                    
                    <li>
                        <ul>
                        <Disclosure>
                            <DisclosureButton className="font-bold py-3 text-sm flex items-center w-full p-2 text-slate transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>

                                {!isCollapsed &&<span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Stocks</span>}
                                {!isCollapsed &&<span className="ml-6 flex items-center">
                                    <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                    <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                </span>}
                            </DisclosureButton>
                            <DisclosurePanel>
                                <li>
                                    <NavLink to="/admin/finish" className={({ isActive }) => `font-bold py-3 flex items-center w-full p-2 text-slate transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                    {!isCollapsed &&<span className="ms-3 text-sm">Finish Products</span>}
                                    </NavLink>
                                </li>
                            </DisclosurePanel>
                        </Disclosure>
                        </ul>
                    </li>
                </ul>
                )}

                {/* Auditor Section */}
                {role === 'auditor' && (
                    <ul>
                        {!isCollapsed &&<h2 className="font-semibold text-neutral-800 text-sm py-3">MENU</h2>}
                        <li>
                            <NavLink 
                                to="/auditor/dashboard" 
                                className={({ isActive }) => `font-bold flex items-center p-2 py-3 text-slate rounded-lg dark:text-white ${isActive ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                                </svg>

                                {!isCollapsed &&<span className="ms-3 text-sm">Dashboard</span>}
                            </NavLink>
                        </li>
                        {!isCollapsed && <h2 className="font-bold text-neutral-800 font-sans text-sm py-3">AUDIT</h2>}
                        <li>
                        <ul>
                            <NavLink to="/auditor/planningScheduling" className={({ isActive }) => `font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg  group hover:bg-gray-100  dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>

                            {!isCollapsed && <span className="ms-3 text-sm">Planing & Scheduling</span>}
                            </NavLink>
                        </ul>
                        <ul>
                            <NavLink to="/auditor/execution" className={({ isActive }) => `font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>


                            {!isCollapsed &&<span className="ms-3 text-sm">Execution</span>}
                            </NavLink>
                        </ul>
                        <ul>
                            <NavLink to="/audit" className={({ isActive }) => `font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>


                            {!isCollapsed &&<span className="ms-3 text-sm">Trail Documentation</span>}
                            </NavLink>
                        </ul>
                    </li> 
                    {!isCollapsed && <h2 className="font-bold text-neutral-800 font-sans text-sm py-3">MAINTENANCE</h2>}
                    <ul>
                        <NavLink to="/auditor/maintenanceScheduling" className={({ isActive }) => `font-bold flex items-center w-full p-2 py-3 text-slate transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>


                        {!isCollapsed &&<span className="ms-3 text-sm">Maintenance Scheduling</span>}
                        </NavLink>
                    </ul>
                </ul> 
                )}
            </div>
        </div>
    );
};

export default Sidebar;
