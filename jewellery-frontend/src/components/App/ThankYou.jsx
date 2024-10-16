// src/components/ThankYou.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ThankYou = () => {
  const location = useLocation();
  const { orderSummary } = location.state || {}; // Get orderSummary from location state
  const [products, setProducts] = useState([]); // State to hold fetched product details
  const [error, setError] = useState(null); // State to hold error message
  const token = localStorage.getItem('accessToken'); // Retrieve token from local storage or context

  // Fetch product details by ID
  const fetchProductById = async (productId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the product data
    } catch (error) {
      console.error(`Error fetching product ID ${productId}:`, error);
      return null; // Return null if there's an error
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (orderSummary && orderSummary.order_items.length > 0) {
        const fetchedProducts = []; // Array to hold all fetched products

        // Loop through each order item and fetch product details
        for (const item of orderSummary.order_items) {
          const productDetails = await fetchProductById(item.product); // Fetch product details by ID
          if (productDetails) {
            fetchedProducts.push({ ...productDetails, quantity: item.quantity }); // Add product details and quantity to the array
          } else {
            setError(`Product with ID ${item.product} not found.`); // Set error if product is not found
          }
        }
        setProducts(fetchedProducts); // Set the state with fetched products
      } else {
        setError('No order items found.'); // Set error if no order items exist
      }
    };

    fetchProducts();
  }, [orderSummary, token]); // Fetch products when orderSummary changes

  // Calculate the total price, applying discount if applicable
  const getTotalPrice = () => {
    if (!orderSummary) return 0;
    const total = orderSummary.total_price; // Get the total price
    const discountCoupon = orderSummary.coupon_applied;

    if (discountCoupon === 'DISCOUNT10') {
      return (total * 0.9).toFixed(2); // Apply a 10% discount
    }
    return total.toFixed(2); // Return the total without discount
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Thank You for Your Order!</h1>
      <p className="mt-4">Your order has been successfully placed.</p>

      {error && <p className="text-red-500">{error}</p>} {/* Display error message if exists */}

      {orderSummary && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <p><strong>Order ID:</strong> {orderSummary.id}</p>
          <p><strong>Total Price:</strong> ${getTotalPrice()}</p> {/* Display total price with discount */}
          <p><strong>Coupon Code:</strong> {orderSummary.coupon_applied}</p> 
          <p><strong>Name:</strong> {orderSummary.name}</p>
          <p><strong>Phone Number:</strong> {orderSummary.phone_number}</p>
          <p><strong>Shipping Address:</strong> {orderSummary.shipping_address}</p>
          <p><strong>Billing Address:</strong> {orderSummary.billing_address}</p>
          <h3 className="mt-4 font-medium">Items Ordered:</h3>
          <ul>
            {products.map((product, index) => (
              <li key={index} className="border-b border-gray-300 py-2">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mb-2" />
                <strong>Product:</strong> {product.name}
                <br />
                <strong>Description:</strong> {product.description}
                <br />
                <strong>Price:</strong> ${product.price}
                <br />
                <strong>Quantity Ordered:</strong> {product.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <p>If you have any questions about your order, please contact our support team.</p>
      </div>
    </div>
  );
};

export default ThankYou;
