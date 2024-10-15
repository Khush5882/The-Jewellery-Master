import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart({ open, setOpen , refreshCart}) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  // Fetch cart items on component load
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/cart/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched cart items:", response.data.products);
        setCartItems(response.data.products);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError("Failed to fetch cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token, refreshCart]);

  // Remove item from cart
  const removeItem = async (productId) => {
    // Optimistically update the UI
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/cart/${productId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 204) {
        throw new Error('Failed to remove item');
      }
      console.log(`Product ${productId} removed from cart`);
    } catch (error) {
      console.error('Error removing product from cart:', error);
      // Revert optimistic update in case of error
      setCartItems((prevItems) => [...prevItems, cartItems.find(item => item.product.id === productId)]);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Update quantity in cart
  const updateQuantity = async (productId, quantity) => {
    // Optimistically update the UI
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/cart/${productId}/`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 200) {
        throw new Error('Failed to update quantity');
      }
      console.log(`Product ${productId} quantity updated to ${quantity}`);
    } catch (error) {
      console.error('Error updating product quantity:', error);
      // Revert optimistic update in case of error
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity } : item
        )
      );
      setError("Failed to update quantity. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping Cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {loading && <p>Loading...</p>}
                  {error && <p className="text-red-500">{error}</p>}

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.product.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                alt={item.product.name}
                                src={`http://127.0.0.1:8000${item.product.image}`}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <a href="#">{item.product.name}</a>
                                  </h3>
                                  <p className="ml-4">${item.product.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (item.quantity === 1) {
                                        // If quantity is 1, invoke the remove item function
                                        removeItem(item.product.id);
                                      } else {
                                        // Otherwise, decrease the quantity by 1
                                        updateQuantity(item.product.id, item.quantity - 1);
                                      }
                                    }}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    -
                                  </button>
                                  <span className="mx-2">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.product.id)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>
                      $
                      {cartItems
                        .reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <a
                      onClick={() => navigate('/checkout')}
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Checkout
                    </a>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
