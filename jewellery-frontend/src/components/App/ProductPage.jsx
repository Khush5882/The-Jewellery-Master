import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import Select from 'react-select'; // Importing react-select for multi-select tags
import Header from './Header';
import Cart from './Cart'; 
import Toast from './Toast'; 

export default function Products() {
  // State variables to manage products, filters, and UI states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [refreshCart, setRefreshCart] = useState(false);
  const token = localStorage.getItem('accessToken');

  // Fetch products based on selected filters
  const fetchProducts = async () => {
    try {
      let url = 'http://127.0.0.1:8000/api/products/';
      const queryParams = new URLSearchParams();
      
      if (selectedCategory) queryParams.append('category', selectedCategory);
      if (selectedSubcategory) queryParams.append('subcategory', selectedSubcategory);
      selectedTags.forEach((tag) => queryParams.append('tags', tag));

      if (queryParams.toString()) {
        url = `http://127.0.0.1:8000/products/filter/?${queryParams.toString()}`; // Corrected syntax with backticks
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const baseURL = 'http://127.0.0.1:8000';
      const productsWithFullImages = response.data.map((product) => ({
        ...product,
        image: product.image.startsWith('http') ? product.image : `${baseURL}${product.image}`, // Corrected syntax with backticks
      }));

      setProducts(productsWithFullImages);
    } catch (error) {
      console.error('Error fetching the products:', error);
    }
  };

  // Fetch categories, subcategories, and tags for filtering
  const fetchFilters = async () => {
    try {
      const categoryResponse = await axios.get('http://127.0.0.1:8000/api/categories/');
      const subcategoryResponse = await axios.get('http://127.0.0.1:8000/api/subcategories/');
      const tagsResponse = await axios.get('http://127.0.0.1:8000/api/tags/');

      setCategories(categoryResponse.data);
      setSubcategories(subcategoryResponse.data);
      setTags(tagsResponse.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  // Run when component mounts
  useEffect(() => {
    fetchFilters();
    fetchProducts();
  }, []);

  // Re-fetch products when filters are updated
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, selectedTags]);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/cart/',
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setCartOpen(true); 
        setRefreshCart(true);
        setToastMessage('Product added to cart!');
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
          setRefreshCart(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className="shop-page">
      <h1 className="page-title">Shop Jewelry</h1>

      <div className="filters-container">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Subcategories</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <Select
          isMulti
          options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
          value={tags.filter((tag) => selectedTags.includes(tag.id)).map((tag) => ({ value: tag.id, label: tag.name }))}
          onChange={(selectedOptions) => {
            setSelectedTags(selectedOptions ? selectedOptions.map(option => option.value) : []);
          }}
          className="tags-select"
          placeholder="Select Tags"
          closeMenuOnSelect={false}
        />
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <div className="product-actions">
                <button onClick={() => addToCart(product.id)} className="add-to-cart-btn">Add to Cart</button>
                <Link to={`/product/${product.id}`} className="view-details-btn">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Toast show={showToast} message={toastMessage} />
      <Cart open={cartOpen} setOpen={setCartOpen} refreshCart={refreshCart} />
    </div>
  );
}
