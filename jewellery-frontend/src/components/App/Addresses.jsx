// src/components/AddAddressForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddAddressForm = ({ token, setAddresses, setShowAddAddress }) => {
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', postal_code: '' , country:'canada'}); // Update key to postal_code
  const [error, setError] = useState('');
  const addressInputRef = useRef(null);

  useEffect(() => {
    // Load Google Places API script
    const loadScript = (url, callback) => {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onload = callback;
      document.head.appendChild(script);
    };

    // api for automatic address completion
     
    loadScript(`https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=23acef0a0a1d42779582f49bd14b272c`, () => {
    
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setNewAddress({
          ...newAddress,
          street: place.formatted_address,
          city: place.address_components.find(component => component.types.includes('locality'))?.long_name || '',
          state: place.address_components.find(component => component.types.includes('administrative_area_level_1'))?.short_name || '',
          postal_code: place.address_components.find(component => component.types.includes('postal_code'))?.long_name || '',
        });
      });
    });
  }, []);

  
  // Handle new address submission
  const handleAddressAddition = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/addresses/', newAddress, {
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
