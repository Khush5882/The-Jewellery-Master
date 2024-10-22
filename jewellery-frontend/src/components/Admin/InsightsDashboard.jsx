import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from 'react-chartjs-2'; 
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register all required components

const InsightsDashboard = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/insights/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInsights(response.data.insights);
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError("Failed to fetch insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [token]);

  // Prepare data for charts
  const barData = {
    labels: insights.map(insight => insight.order_date),
    datasets: [
      {
        label: 'Total Revenue',
        data: insights.map(insight => insight.total_revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: insights.map(insight => insight.order_date),
    datasets: [
      {
        label: 'Total Orders',
        data: insights.map(insight => insight.total_orders),
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  if (loading) return <p>Loading insights...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="insights-dashboard">
      <h2 className="text-2xl font-semibold">Business Insights</h2>
      <div>
        <h3>Total Revenue: ${insights.reduce((acc, curr) => acc + curr.total_revenue, 0)}</h3>
        <h3>Total Orders: {insights.reduce((acc, curr) => acc + curr.total_orders, 0)}</h3>
      </div>
      {insights.length > 0 ? (
        <>
          <div>
            <h4>Revenue Over Time</h4>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
          <div>
            <h4>Orders Over Time</h4>
            <Line data={lineData} options={{ responsive: true }} />
          </div>
        </>
      ) : (
        <p>No insights available.</p>
      )}
    </div>
  );
};

export default InsightsDashboard;
