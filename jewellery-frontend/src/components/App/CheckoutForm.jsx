import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import AddAddressForm from './Addresses';
import CartSummary from './CartSummary';

const CheckoutForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState('');
  const [selectedShippingAddress, setSelectedShippingAddress] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('PAYPAL'); // Default to PayPal
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/addresses/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to fetch addresses.');
      }
    };

    fetchAddresses();
  }, [token]);
  
  const calculateTotalCost = () => {
    const validSubTotal = typeof subTotal === 'number' ? subTotal : 0; // Fallback to 0 if subTotal is invalid
    const discountedPrice = validSubTotal - (validSubTotal * (discount / 100));
    console.log("Discounted Price:", discountedPrice);
    return Math.max(discountedPrice, 0); // Ensure total doesn't go below 0
  };
  

  const removeItem = async (productId) => {
    // Optimistically update the UI
    setOrderItems((prevItems) => prevItems.filter((item) => item.product !== productId));

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
      setOrderItems((prevItems) => [...prevItems, { product: productId }]);
      setError("Failed to remove item. Please try again.");
    }
  };

  const emptyCart = async () => {
    for (const item of orderItems) {
      await removeItem(item.product); 
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
  
    // Check for required fields
    if (!name || !phone || !selectedBillingAddress || !selectedShippingAddress) {
      setError('Please fill in all required fields.');
      return;
    }
  
    // Calculate the total cost and store in a local variable
    const calculatedTotalCost = calculateTotalCost(); // Get the discounted price
  
    // Use setTimeout to delay the order placement
    setTimeout(async () => {
      const orderData = {
        total_price: calculatedTotalCost, // Use the calculated total cost directly
        name,
        phone_number: phone,
        shipping_address: selectedShippingAddress,
        billing_address: selectedBillingAddress,
        coupon_applied: couponCode,
        order_items: orderItems,
        payment_method: paymentMethod,
      };
  
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/orders/', orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Order placed successfully:', response.data);
  
        // Call emptyCart to remove all items from the cart
        await emptyCart();
  
        // Resetting form fields after successful order placement
        setName('');
        setPhone('');
        setSelectedBillingAddress('');
        setSelectedShippingAddress('');
        setCouponCode('');
        setDiscount(0);
        setOrderItems([]);
  
        // Navigate to the Thank You page with order summary
        navigate('/thank-you', { state: { orderSummary: response.data } });
  
      } catch (error) {
        console.error('Error placing order:', error);
        setError('Failed to place order. Please try again later.');
      }
    }, 2000); // Delay execution by 2000 milliseconds (2 seconds)
  };
  
  

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={placeOrder} id='checkout-form'>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <h2 className="text-lg font-medium mt-4">Select Billing Address</h2>
          <select
            value={selectedBillingAddress}
            onChange={(e) => setSelectedBillingAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select Billing Address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}
              </option>
            ))}
          </select>
          <h2 className="text-lg font-medium mt-4">Select Shipping Address</h2>
          <select
            value={selectedShippingAddress}
            onChange={(e) => setSelectedShippingAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select Shipping Address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}
              </option>
            ))}
          </select>

          {/* Payment Method Selection */}
          <h2 className="text-lg font-medium mt-4">Select Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="PAYPAL">PayPal</option>
            <option value="CARD">Credit/Debit Card</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </form>

        <div className="mt-4">
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Address
          </button>
          {showAddAddress && (
            <AddAddressForm
              token={token}
              setAddresses={setAddresses}
              setShowAddAddress={setShowAddAddress}
            />
          )}
        </div>
        <button
          type="submit"
          form='checkout-form'
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Place Order
        </button>
      </div>

      <CartSummary
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        discount={discount}
        setDiscount={setDiscount}
        subtotal={subTotal}
        setSubtotal={setSubTotal}
        setOrderItems={setOrderItems}
      />
    </div>
  );
};

export default CheckoutForm;
