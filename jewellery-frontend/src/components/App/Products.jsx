// Products.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Cart from './Cart'; // Ensure Cart is imported
import Toast from './Toast'; // Import the Toast component

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false); // State for showing toast
  const [toastMessage, setToastMessage] = useState(''); // State for the toast message
  const [cartOpen, setCartOpen] = useState(false);
  const [refreshCart, setRefreshCart] = useState(false); // State to trigger cart refresh
  const token = localStorage.getItem('accessToken'); // Retrieve the access token

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the access token in the Authorization header
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, [token]);

  // Function to handle adding the product to the cart
  const addToCart = async (productId) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/cart/',
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        setCartOpen(true); // Open the cart
        setRefreshCart(true); // Trigger the refresh function
        setToastMessage('Product added to cart!'); 
        setShowToast(true); 

        setTimeout(() => {
          setShowToast(false);
          setRefreshCart(false); // Reset the refresh state after a timeout
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className='container'>
      <div className="flex flex-wrap justify-center space-x-4 ">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 m-6 relative overflow-hidden bg-purple-500 rounded-lg max-w-xs shadow-lg group"
          >
            <svg
              className="absolute bottom-0 left-0 mb-8 scale-150 group-hover:scale-[1.65] transition-transform"
              viewBox="0 0 375 283"
              fill="none"
              style={{ opacity: 0.1 }}
            >
              <rect
                x="159.52"
                y="175"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 159.52 175)"
                fill="white"
              />
              <rect
                y="107.48"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 0 107.48)"
                fill="white"
              />
            </svg>
            <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div
                className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                style={{
                  background: 'radial-gradient(black, transparent 60%)',
                  transform: 'rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)',
                  opacity: 0.2,
                }}
              ></div>
              <img className="relative w-40 h-40" src={product.image} alt={product.name} />
            </div>
            <div className="relative text-white px-6 pb-6 mt-6">
              <span className="block opacity-75 -mb-1">{product.description}</span>
              <div className="flex justify-between">
                <span className="block font-semibold text-xl">{product.name}</span>
                <span className="bg-white rounded-full text-purple-500 text-xs font-bold px-3 py-2 leading-none flex items-center">
                  ${product.price}
                </span>
              </div>
              <button
                onClick={() => addToCart(product.id)} // Simplified button click handler
                className="mt-4 bg-purple-600 hover:bg-pink-500 text-white text-sm font-semibold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pass refreshCart as a prop to the Cart component */}
      <Cart open={cartOpen} setOpen={setCartOpen} refreshCart={refreshCart} /> 

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
}
