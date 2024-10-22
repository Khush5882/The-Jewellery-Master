import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]); // Initialize orders as an empty array
  const [error, setError] = useState(null); // State to hold error messages
  const [productDetails, setProductDetails] = useState({}); // State to hold fetched product details
  const token = localStorage.getItem('accessToken'); // Retrieve token from local storage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/orders/', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the access token in headers
          },
        });

        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setOrders(response.data); // Set orders if it's an array
        } else {
          setError("Unexpected data format. Please try again."); // Set error if data format is unexpected
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders. Please try again later."); // Set error message
      }
    };

    fetchOrders();
  }, [token]); // Fetch orders only on component mount

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

  // Fetch product details for all orders
  const fetchAllProductDetails = async (orderItems) => {
    const products = {};
    await Promise.all(
      orderItems.map(async (item) => {
        const productData = await fetchProductById(item.product);
        if (productData) {
          products[item.product] = productData; // Store product data by product ID
        }
      })
    );
    setProductDetails(products); // Set all fetched product details
  };

  // Fetch product details when orders are fetched
  useEffect(() => {
    if (orders.length > 0) {
      const orderItems = orders.flatMap(order => order.order_items); // Flatten the order items array
      fetchAllProductDetails(orderItems); // Fetch product details
    }
  }, [orders]); // Run this effect when orders change

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if exists */}
      
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order.id} className="mb-6 p-4 border rounded shadow-md bg-white">
            <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone Number:</strong> {order.phone_number}</p>
            <p><strong>Billing Address:</strong> {order.billing_address}</p>
            <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
            <p><strong>Total Price:</strong> ${order.total_price}</p>
            <p><strong>Coupon Applied:</strong> {order.coupon_applied || "No coupon applied"}</p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <h4 className="mt-4 font-medium">Order Items:</h4>
            <ul className="list-disc list-inside">
              {order.order_items.map((item, index) => (
                <li key={index} className="ml-4 mb-2">
                  <strong>Product ID:</strong> {item.product}
                  <br />
                  <strong>Quantity:</strong> {item.quantity}
                  {/* Show fetched product details if available */}
                  {productDetails[item.product] && (
                    <div className="flex items-center mt-2">
                      <img 
                        src={productDetails[item.product].image} // Directly use the image URL
                        alt={productDetails[item.product].name}
                        className="w-16 h-16 object-cover rounded-md mr-2" // Ensure the image is styled correctly
                      />
                      <div>
                        <strong>Name:</strong> {productDetails[item.product].name}
                        <br />
                        <strong>Description:</strong> {productDetails[item.product].description}
                        <br />
                        <strong>Price:</strong> ${productDetails[item.product].price}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No orders found.</p> 
      )}
    </div>
  );
};

export default OrderList;
