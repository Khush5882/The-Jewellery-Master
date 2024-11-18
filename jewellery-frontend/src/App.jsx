import { useState } from 'react';
import './App.css';
import Login from './components/Auth/Login';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from './components/Auth/Register';
import Products from './components/App/Products';
import Cart from './components/App/Cart';
import Home from './components/App/Home';
import Footer from './components/App/Footer';
import Header from './components/App/Header'; // Import your Header component
import AboutJewelryMaster from './components/App/About';
import AdminRegister from './components/Auth/AdminReg';
import UserProfile from './components/App/Profile';
import CheckoutForm from './components/App/CheckoutForm';
import ThankYou from './components/App/ThankYou';
import JewelryCustomization from './components/App/JewelleryCustomization';
import Admin from './components/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import ChatBot from './components/Chatbot/ChatBot'
import MetalPrices from './components/App/MetalInvestPage';
import ProductPage from './components/App/ProductPage';

function App() {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Render Header only if the path is not /login or /register */}
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/adminreg' && <Header />}
      
      <div>
        {/* Render ChatBot only if the path is not /login or /register */}
        {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/adminreg' && <ChatBot />}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminreg" element={<AdminRegister />} />
          <Route path='/' element={<Home />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutJewelryMaster />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/jewellery-customization" element={<JewelryCustomization />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
          <Route path="/metal-prices"  element={<MetalPrices />} />
          <Route path="/product/:id" element={<ProductPage />} />


        </Routes>
      </div>

      {/* Render Footer only if the path is not /login or /register */}
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/adminreg' && <Footer />}
    </>
  );
}

// Wrap App with Router to provide routing context
const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
