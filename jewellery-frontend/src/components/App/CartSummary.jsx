import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartSummary = ({ couponCode, setCouponCode, discount, setDiscount, subtotal, setSubtotal, setOrderItems }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/cart/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const products = response.data.products;
        console.log(products);
        
        // Transform products to the desired format
        const orderItems = products.map(item => ({
          product: item.product.id,  // Use the product ID
          quantity: item.quantity
        }));
        
        setOrderItems(orderItems); // Set order items in the required format
        setCartItems(products);

        // Calculate subtotal
        const calculatedSubtotal = products.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
        setSubtotal(calculatedSubtotal);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError("Failed to fetch cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token, setSubtotal, setOrderItems]);

  const applyCoupon = () => {
    if (couponCode === 'DISCOUNT10') {
      setDiscount(10); // Apply a 10% discount
    } else {
      setError('Invalid coupon code');
      setDiscount(0); // Reset discount on invalid coupon
    }
  };

  const discountAmount = (discount > 0) ? (subtotal * (discount / 100)).toFixed(2) : 0;
  const total = (subtotal - discountAmount).toFixed(2);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Cart Summary</h2>
      {loading ? (
        <p>Loading cart items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.product.id} className="mb-2 flex items-center">
                  <img
                    src={`http://127.0.0.1:8000${item.product.image}`}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md mr-2"
                  />
                  <div>
                    <p>{item.product.name} x {item.quantity}</p>
                    <p>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <p className="font-medium">Subtotal: ${subtotal.toFixed(2)}</p>
            {discount > 0 && (
              <p className="font-medium text-green-500">Discount: -${discountAmount}</p>
            )}
            <p className="font-medium">Total: ${total}</p>
          </div>
        </>
      )}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={applyCoupon}
          className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Apply Coupon
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
