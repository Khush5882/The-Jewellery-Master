import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]); // Store orders
  const [error, setError] = useState(null); // Store error messages
  const token = localStorage.getItem("accessToken"); // Access token from localStorage

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/allorders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {error && <p className="text-red-500">{error}</p>}

      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="mb-6 p-4 border rounded shadow-md bg-white"
          >
            <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
            <p>
              <strong>Name:</strong> {order.name}
            </p>
            <p>
              <strong>Phone Number:</strong> {order.phone_number}
            </p>
            <p>
              <strong>Billing Address:</strong> {order.billing_address}
            </p>
            <p>
              <strong>Shipping Address:</strong> {order.shipping_address}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.payment_method}
            </p>
            <p>
              <strong>Total Price:</strong> ${order.total_price}
            </p>
            <p>
              <strong>Coupon Applied:</strong>{" "}
              {order.coupon_applied || "No coupon applied"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
            <h4 className="mt-4 font-medium">Order Items:</h4>
            <ul className="list-disc list-inside">
              {order.order_items.map((item, index) => (
                <li key={index} className="ml-4 mb-2">
                  <p>
                    <strong>Product Name:</strong> {item.product.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {item.product.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.product.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <div className="flex items-center mt-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md mr-2"
                    />
                  </div>
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
