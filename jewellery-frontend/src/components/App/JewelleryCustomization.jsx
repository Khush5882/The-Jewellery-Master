import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JewelryCustomizationForm = () => {
  const [formData, setFormData] = useState({
    jewelry_type: '',
    material: '',
    size: '',
    engraving_text: '',
    price: '',
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [jewelryTypes, setJewelryTypes] = useState([]);
  const [materials, setMaterials] = useState([]);

  const token = localStorage.getItem('accessToken');  // Get JWT token or any auth method you use

  // Fetch jewelry types and materials from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/jewelry_options/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setJewelryTypes(response.data.jewelry_types);
        setMaterials(response.data.materials);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/jewelry_customization/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        setSuccess('Customization successfully submitted!');
        setError(null);
      }
    } catch (error) {
      console.error('Error:', error);
      console.error('Error Details:', error.response?.data);  // Log detailed error
      setError(error.response?.data?.detail || 'There was an error submitting your customization.');
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Jewelry</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Jewelry Type</label>
        <select
          name="jewelry_type"
          value={formData.jewelry_type}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Select Jewelry Type</option>
          {jewelryTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label className="block mb-2">Material</label>
        <select
          name="material"
          value={formData.material}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Select Material</option>
          {materials.map((material) => (
            <option key={material} value={material}>{material}</option>
          ))}
        </select>

        <label className="block mb-2">Size (Optional)</label>
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <label className="block mb-2">Engraving (Optional)</label>
        <input
          type="text"
          name="engraving_text"
          value={formData.engraving_text}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <label className="block mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Submit Customization
        </button>
      </form>
    </div>
  );
};

export default JewelryCustomizationForm;
