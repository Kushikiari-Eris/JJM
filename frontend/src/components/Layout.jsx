import React, { useState } from 'react'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  return (
    <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-blue-800 text-white w-64 ${isSidebarOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
                <div className="px-6 py-4 font-semibold text-lg border-b border-blue-700">
                    Dashboard
                </div>
                <div className="p-4">
                    <button
                        onClick={() => toggleMenu('menu1')}
                        className="w-full text-left p-2 rounded hover:bg-blue-700"
                    >
                        Menu 1
                    </button>
                    {activeMenu === 'menu1' && (
                        <div className="ml-4 space-y-2">
                            <a href="#item1" className="block text-sm hover:underline">Item 1</a>
                            <a href="#item2" className="block text-sm hover:underline">Item 2</a>
                            <a href="#item3" className="block text-sm hover:underline">Item 3</a>
                        </div>
                    )}
                    <button
                        onClick={() => toggleMenu('menu2')}
                        className="w-full text-left p-2 rounded hover:bg-blue-700"
                    >
                        Menu 2
                    </button>
                    {activeMenu === 'menu2' && (
                        <div className="ml-4 space-y-2">
                            <a href="#item4" className="block text-sm hover:underline">Item 4</a>
                            <a href="#item5" className="block text-sm hover:underline">Item 5</a>
                            <a href="#item6" className="block text-sm hover:underline">Item 6</a>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col w-full">
                {/* Navbar */}
                <nav className="bg-white shadow p-4 flex items-center justify-between">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-blue-800 focus:outline-none"
                    >
                        {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                    </button>
                    <h1 className="text-lg font-bold">My Application</h1>
                    <div className="space-x-4">
                        <button className="text-gray-800 hover:text-blue-600">Profile</button>
                        <button className="text-gray-800 hover:text-blue-600">Settings</button>
                    </div>
                </nav>

                {/* Inside Component */}
                <main className="flex-1 p-6">
                    <h2 className="text-2xl font-semibold mb-4">Content Area</h2>
                    <p>This is where the main content will be displayed.</p>
                </main>
            </div>
        </div>
  )
}

export default Layout