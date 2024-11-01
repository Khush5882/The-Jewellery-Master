import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Cart from './Cart';
import Toast from './Toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [refreshCart, setRefreshCart] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [token]);

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

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    if (sortOption === 'priceLowHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceHighLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'nameAsc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'nameDesc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  };

  const filteredProducts = applyFilters();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Products</h1>

      {/* Filter and Sort Section */}
      <div className="flex justify-center space-x-4 mb-8">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2 shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2 shadow-sm"
        >
          <option value="">All Prices</option>
          <option value="0-20">Under $20</option>
          <option value="20-50">$20 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-200">$100 - $200</option>
          <option value="200-500">$200 - $500</option>
          <option value="500-1000">$500 - $1000</option>
        </select>

        {/* Sorting Options */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2 shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="nameAsc">Name: A to Z</option>
          <option value="nameDesc">Name: Z to A</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="flex flex-wrap justify-center space-x-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 m-6 relative overflow-hidden bg-purple-500 rounded-lg max-w-xs shadow-lg group"
          >
            <svg
              className="absolute bottom-0 left-0 mb-8 scale-150 group-hover:scale-[1.65] transition-transform"
              viewBox="0 0 375 283"
              fill="none"
              style={{ opacity: 0.1 }}
            >
              <rect
                x="159.52"
                y="175"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 159.52 175)"
                fill="white"
              />
              <rect
                y="107.48"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 0 107.48)"
                fill="white"
              />
            </svg>
            <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div
                className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                style={{
                  background: 'radial-gradient(black, transparent 60%)',
                  transform: 'rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)',
                  opacity: 0.2,
                }}
              ></div>
              <img className="relative w-40 h-40" src={product.image} alt={product.name} />
            </div>
            <div className="relative text-white px-6 pb-6 mt-6">
              <span className="block opacity-75 -mb-1">{product.description}</span>
              <div className="flex justify-between">
                <span className="block font-semibold text-xl">{product.name}</span>
                <span className="bg-white rounded-full text-purple-500 text-xs font-bold px-3 py-2 leading-none flex items-center">
                  ${product.price}
                </span>
              </div>
              <button
                onClick={() => addToCart(product.id)}
                className="mt-4 bg-purple-600 hover:bg-pink-500 text-white text-sm font-semibold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart and Toast Components */}
      <Cart open={cartOpen} setOpen={setCartOpen} refreshCart={refreshCart} />
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
}
