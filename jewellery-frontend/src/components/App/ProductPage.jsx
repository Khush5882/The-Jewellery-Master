import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import useParams for URL params
import Header from './Header';
import Cart from './Cart';
import Toast from './Toast';

export default function ProductPage() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const token = localStorage.getItem('accessToken'); 

  // Fetch product details by ID
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const baseURL = 'http://127.0.0.1:8000';
      const productWithFullImage = {
        ...response.data,
        image: response.data.image.startsWith('http') ? response.data.image : `${baseURL}${response.data.image}`,
      };

      setProduct(productWithFullImage);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Handle add to cart
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
        setToastMessage('Product added to cart!');
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Show loading while the product is being fetched
  }

  return (
    <div className="container">
      <div className="product-page my-6">
        <div className="flex flex-wrap gap-10">
          <div className="product-image flex-shrink-0 w-1/2">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          </div>

          <div className="product-details w-1/2">
            <h1 className="text-3xl font-semibold text-purple-500">{product.name}</h1>
            <p className="text-lg text-gray-700 my-4">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-purple-500">${product.price}</span>
              <button
                onClick={() => addToCart(product.id)}
                className="bg-purple-600 hover:bg-pink-500 text-white text-sm font-medium px-6 py-2 rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="my-6">
          <Link to="/shop" className="text-sm text-purple-500 underline">Back to Products</Link>
        </div>
      </div>
      
      <Toast show={showToast} message={toastMessage} />
    </div>
  );
}
