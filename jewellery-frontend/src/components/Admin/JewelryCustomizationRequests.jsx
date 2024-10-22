import React, { useEffect, useState } from "react";
import axios from "axios";

const JewelryCustomizationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Retrieve the token from local storage
  const token = localStorage.getItem('accessToken'); 

  useEffect(() => {
    const fetchCustomizationRequests = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jewelry_customization/', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching customization requests:", error);
        setError("Failed to fetch customization requests. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchCustomizationRequests();
  }, [token]); // Include token in dependency array

  if (loading) {
    return <div className="text-center">Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>; // Show error message
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Jewelry Customization Requests</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Material</th>
            <th className="border px-4 py-2">Size</th>
            <th className="border px-4 py-2">Engraving</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Creator</th> {/* New column for creator name */}
            <th className="border px-4 py-2">Created At</th> {/* New column for creation date */}
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{request.jewelry_type}</td>
              <td className="border px-4 py-2">{request.material}</td>
              <td className="border px-4 py-2">{request.size}</td>
              <td className="border px-4 py-2">{request.engraving_text}</td>
              <td className="border px-4 py-2">${request.price}</td>
              <td className="border px-4 py-2">{request.creator_name}</td> {/* Display creator name */}
              <td className="border px-4 py-2">{new Date(request.created_at).toLocaleString()}</td> {/* Format created_at */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JewelryCustomizationRequests;
