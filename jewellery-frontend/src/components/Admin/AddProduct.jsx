import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Replace 'your_token_here' with how you retrieve your token (e.g., from local storage)
  const token = localStorage.getItem('accessToken');

  // Fetch categories, subcategories, and tags (can be static or fetched from an API)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subcategories/');
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tags/');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchCategories();
    fetchSubcategories();
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    }

    // Append selected categories, subcategories, and tags
    selectedCategories.forEach((category) => formData.append('category', category));
    selectedSubcategories.forEach((subcategory) => formData.append('subcategory', subcategory));
    selectedTags.forEach((tag) => formData.append('tags', tag));

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(`Product added successfully: ${response.data.name}`);
      setErrorMessage('');
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImage(null);
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      setSelectedTags([]);
    } catch (error) {
      setErrorMessage('Failed to add product. Please try again.');
      setSuccessMessage('');
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        {/* Categories Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Categories:</label>
          <select
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategories Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Subcategories:</label>
          <select
            multiple
            value={selectedSubcategories}
            onChange={(e) => setSelectedSubcategories(Array.from(e.target.selectedOptions, option => option.value))}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tags:</label>
          <select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>

      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default AddProduct;
