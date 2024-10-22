import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JewelryCustomizationForm = () => {
  const [formData, setFormData] = useState({
    jewelry_type: '',
    material: '',
    size: '',
    engraving_text: '',
    price: 0,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [jewelryTypes, setJewelryTypes] = useState([]);
  const [materials, setMaterials] = useState([]);

  const token = localStorage.getItem('accessToken'); // Get JWT token or any auth method you use

  // Base prices for jewelry types and materials (you can fetch these from the backend too)
  const basePrices = {
    jewelry_type: {
      ring: 100,
      necklace: 200,
      bracelet: 150,
    },
    material: {
      gold: 300,
      silver: 100,
      platinum: 500,
    },
  };

  // Hardcoded images for each jewelry type and material
  const jewelryImages = {
    ring: {
      gold: '/images/ring_gold.jpg',
      silver: '/images/ring_silver.jpg',
      platinum: '/images/ring_silver.jpg',
    },
    necklace: {
      gold: '/images/necklace_gold.jpg',
      silver: '/images/necklace_silver.jpg',
      platinum: '/images/necklace_silver.jpg',
    },
    bracelet: {
      gold: '/images/bracelet_gold.jpg',
      silver: '/images/bracelet_silver.jpg',
      platinum: '/images/bracelet_silver.jpg',
    },
    earrings: {
      gold: '/images/earring_gold.jpg',
      silver: '/images/earring_silver.jpg',
      platinum: '/images/earring_silver.jpg',
    },
  };

  // Fetch jewelry types and materials from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/jewelry_options/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJewelryTypes(response.data.jewelry_types);
        setMaterials(response.data.materials);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchData();
  }, [token]);

  // Function to calculate price based on selected options
  const calculatePrice = (type, material, engraving) => {
    const typePrice = basePrices.jewelry_type[type] || 0;
    const materialPrice = basePrices.material[material] || 0;
    const engravingPrice = engraving ? 100 : 0; // Add $100 if engraving text is not empty

    return typePrice + materialPrice + engravingPrice; // Return the total price
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Recalculate the price if either jewelry type, material, or engraving changes
    if (name === 'jewelry_type' || name === 'material' || name === 'engraving_text') {
      const updatedPrice = calculatePrice(
        newFormData.jewelry_type,
        newFormData.material,
        newFormData.engraving_text
      );
      newFormData.price = updatedPrice;
    }

    setFormData(newFormData);
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
      console.error('Error Details:', error.response?.data); // Log detailed error
      setError(error.response?.data?.detail || 'There was an error submitting your customization.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Customize Your Jewelry</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <div className="flex flex-col md:flex-row">
        <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <label className="block mb-2 text-lg font-semibold">Jewelry Type</label>
          <select
            name="jewelry_type"
            value={formData.jewelry_type}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded"
          >
            <option value="">Select Jewelry Type</option>
            {jewelryTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <label className="block mb-2 text-lg font-semibold">Material</label>
          <select
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded"
          >
            <option value="">Select Material</option>
            {materials.map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>

          <label className="block mb-2 text-lg font-semibold">Size (Optional)</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded"
          />

          <label className="block mb-2 text-lg font-semibold">Engraving (Optional)</label>
          <input
            type="text"
            name="engraving_text"
            value={formData.engraving_text}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded"
          />

          <label className="block mb-2 text-lg font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded"
            disabled
          />

       

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full mt-4 transition duration-200">
            Submit Customization
          </button>
        </form>

        {/* Image display section */}
        {formData.jewelry_type && formData.material && (
          <div className="flex justify-center items-center mt-4 md:mt-0 md:ml-4">
            <img
              src={jewelryImages[formData.jewelry_type][formData.material]}
              alt={`Image of a ${formData.jewelry_type} made of ${formData.material}`}
              className="max-w-xs h-auto rounded shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JewelryCustomizationForm;
