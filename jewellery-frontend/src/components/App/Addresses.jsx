// src/components/AddAddressForm.js
//vedio: Build an ecommerce website with Django and React // Part 9 - Updating and deleting addresses (
// CHAT GPT was use dto imporve the code for better eroor handling and data submission.
// ChatGPT assisted in refining the structure and logic of the address addition process.
import React, { useState } from 'react';
import axios from 'axios';

const AddAddressForm = ({ token, setAddresses, setShowAddAddress }) => {
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', postal_code: '' , country:'canada'}); // Update key to postal_code
  const [error, setError] = useState('');

  // Handle new address submission
  const handleAddressAddition = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const response = await axios.post('http://127.0.0.1:8000/addresses/', newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update addresses state with the new address
      setAddresses((prevAddresses) => [...prevAddresses, response.data]);
      // Reset new address form
      setNewAddress({ street: '', city: '', state: '', postal_code: '' });
      // Hide add address form
      setShowAddAddress(false); 
    } catch (error) {
      console.error('Error adding address:', error);
      // Handle the error response
      if (error.response && error.response.data) {
        // Assuming your API sends back detailed validation errors
        setError('Failed to add address: ' + error.response.data.detail || 'Invalid data provided.');
      } else {
        setError('Failed to add address.');
      }
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-md">
      <h2 className="text-lg font-medium">Add New Address</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleAddressAddition}>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            value={newAddress.postal_code} // Update to postal_code
            onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Address
        </button>
      </form>
    </div>
  );
};

export default AddAddressForm;
