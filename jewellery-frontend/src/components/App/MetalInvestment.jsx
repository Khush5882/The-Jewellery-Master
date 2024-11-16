import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function MetalInvestment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/metal/get-metal-investment-recommendation/"
        );
        setData(response.data);
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-purple-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-200 shadow-lg rounded-lg mt-12">
      <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-6">Metal Investment Recommendations</h2>
      
      <div className="text-center mb-8 text-gray-700">
        <p className="text-lg">
          <strong>Currency:</strong> {data.currency}
        </p>
        <p className="text-lg">
          <strong>Unit:</strong> {data.unit}
        </p>
        <p className="text-lg">
          <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {Object.keys(data.investment_recommendations).map((metal) => (
          <div key={metal} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-purple-700 capitalize">{metal}</h3>
            <p className="text-gray-600 mt-2">
              <strong>Price:</strong> ${data.investment_recommendations[metal].price.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Investment Cost:</strong> ${data.investment_recommendations[metal].investment_cost.toFixed(2)}
            </p>
            <p
              className={`mt-3 font-bold ${
                data.investment_recommendations[metal].recommendation === "Yes"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <strong>Recommendation:</strong>{" "}
              {data.investment_recommendations[metal].recommendation === "Yes"
                ? "Invest"
                : "Do Not Invest"}
            </p>
          </div>
        ))}
      </div>

      {/* Display LangChain generated investment suggestions */}
      {data.investment_suggestions && (
        <div className="mt-8 p-6 bg-purple-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">AI Investment Suggestions</h3>
          <div className="text-gray-800">
            <ReactMarkdown>{data.investment_suggestions}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetalInvestment;
