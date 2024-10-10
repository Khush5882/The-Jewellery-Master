import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    billing_address: '',
    shipping_address: ''
  });
  const [error, setError] = useState(null); // State to handle error messages

  useEffect(() => {
    // Fetch user info when component mounts
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Assuming you are storing token in local storage
          }
        });
        setUserInfo(response.data);
        setFormData(response.data);
        setError(null); // Clear error if fetch is successful
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('UserInfo does not exist. Please enter your details below.');
        } else {
          console.error('Error fetching user info:', error);
          setError('An error occurred while fetching your profile.');
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userInfo); // Reset form to userInfo state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      setUserInfo(formData); // Update userInfo with new data
      setIsEditing(false);
      setError(null); // Clear error if update is successful
    } catch (error) {
      console.error('Error updating user info:', error);
      setError('An error occurred while updating your profile.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

      {userInfo ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <span className="font-semibold">First Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            ) : (
              <p>{userInfo.first_name}</p>
            )}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Last Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            ) : (
              <p>{userInfo.last_name}</p>
            )}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Phone Number:</span>
            {isEditing ? (
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            ) : (
              <p>{userInfo.phone_number}</p>
            )}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Billing Address:</span>
            {isEditing ? (
              <input
                type="text"
                name="billing_address"
                value={formData.billing_address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p>{userInfo.billing_address}</p>
            )}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Shipping Address:</span>
            {isEditing ? (
              <input
                type="text"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p>{userInfo.shipping_address}</p>
            )}
          </div>

          {isEditing ? (
            <div className="flex space-x-4">
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Edit Profile
            </button>
          )}
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-red-500">UserInfo does not exist. Please enter your details below:</p>
          <div className="mb-4">
            <span className="font-semibold">First Name:</span>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <span className="font-semibold">Last Name:</span>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <span className="font-semibold">Phone Number:</span>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <span className="font-semibold">Billing Address:</span>
            <input
              type="text"
              name="billing_address"
              value={formData.billing_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <span className="font-semibold">Shipping Address:</span>
            <input
              type="text"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Create Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
