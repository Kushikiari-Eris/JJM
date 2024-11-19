import { Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Market from './pages/market/Market';
import AuthContext, { AuthContextProvider } from './context/AuthContext';
import React, { lazy, useContext } from 'react';
import AdminPanel from './pages/admin/AdminPanel';
import Product from './pages/admin/products/Product';
import ProductOrders from './pages/admin/products/ProductOrders'
import ProductDetail from './pages/market/ProductDetail';
import Cart from './pages/market/Cart';
import Orders from './pages/market/Orders';
import CheckOut from './pages/market/CheckOut';
import AllProducts from './pages/market/AllProducts';
import Dashboard from './pages/admin/Dashboard';
import Finish from './pages/admin/inventory/stocks/Finish';
import ProductTracking from './pages/admin/products/ProductTracking';
import Users from './pages/admin/products/Users';
import Auditor from './pages/auditor/Auditor';
import { CartProvider, useCartContext } from './context/CartContext';
import AuditDashboard from './pages/auditor/AuditDashboard';
import PlanningScheduling from './pages/auditor/audit/PlanningScheduling';
import MaintenanceScheduling from './pages/auditor/maintenance/MaintenanceScheduling';
import Execution from './pages/auditor/audit/Execution';



function App() {
  return (
    <AuthContextProvider>
      <CartProvider> 
          <RoutesWrapper />
      </CartProvider>
    </AuthContextProvider>
  );
}

function RoutesWrapper() {
  const { loggedIn, role, loading } = useContext(AuthContext);
  const { cartItemCount } = useCartContext();

  // If still loading the auth state, show a loading screen
  if (loading) {
    return<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div class="flex items-center justify-center h-screen">
        <div class="relative">
            <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
            </div>
        </div>
    </div>
  </div>;  // Replace with a proper loading component if you want
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />

      {/**Auth */}
      <Route path='/register' element={!loggedIn ? <Register /> : role === 'admin' ? <Navigate to='/admin/dashboard' /> : role === 'auditor' ? <Navigate to='/auditor/dashboard' /> : <Navigate to='/market' />} />
      <Route path='/login' element={!loggedIn ? <Login /> : role === 'admin' ? <Navigate to='/admin/dashboard' /> : role === 'auditor' ? <Navigate to='/auditor/dashboard' /> : <Navigate to='/market' />} />

      {/**MarketPage */}
      <Route path='/market' element={loggedIn && role === 'user' ? <Market /> : <Navigate to='/login' />} />
      <Route path='/market/allproducts' element={<AllProducts/>}/>
      <Route path='/market/productDetail/:id' element={<ProductDetail />} />
      <Route path='/market/cart' element={<Cart/>}/>
      <Route path='/market/checkout' element={<CheckOut/>}/>
      <Route path='/market/orders' element={<Orders/>}/>

      {/**AdminPage */}
      <Route path='/admin' element={loggedIn && role === 'admin' ? <AdminPanel /> : <Navigate to='/login' />} >
        <Route path='product' element={<Product />} />
        <Route path='orders' element={<ProductOrders/>}/>
        <Route path='users' element={<Users/>}/>
        <Route path='productTracking' element={<ProductTracking/>}/>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='finish' element={<Finish/>}/>
      </Route>

      {/**AuditorPage */}
      <Route path='/auditor' element={loggedIn && role === 'auditor' ? <Auditor /> : <Navigate to='/login' />} >
        <Route path='dashboard' element={<AuditDashboard/>}/>
        <Route path='planningScheduling' element={<PlanningScheduling/>}/>
        <Route path='maintenanceScheduling' element={<MaintenanceScheduling/>} />
        <Route path='execution' element={<Execution/>} />
      </Route>
    </Routes>
  );
}

export default App;
