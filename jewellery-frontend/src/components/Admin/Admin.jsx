import React, { useState } from 'react';
import InsightsDashboard from './InsightsDashboard';
import JewelryCustomizationRequests from './JewelryCustomizationRequests';
import OrderList from './OrderList';
import AddProduct from './AddProduct'; // Import the AddProduct component

export default function Admin() {
  const [activeComponent, setActiveComponent] = useState('insights'); // Default component

  const renderComponent = () => {
    switch (activeComponent) {
      case 'insights':
        return <InsightsDashboard />;
      case 'customization':
        return <JewelryCustomizationRequests />;
      case 'orders':
        return <OrderList />;
      case 'addProduct': // Case for the AddProduct component
        return <AddProduct />;
      default:
        return <InsightsDashboard />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveComponent('insights')}
          className={`py-2 px-4 rounded-md ${activeComponent === 'insights' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveComponent('customization')}
          className={`py-2 px-4 rounded-md ${activeComponent === 'customization' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Customization Requests
        </button>
        <button
          onClick={() => setActiveComponent('orders')}
          className={`py-2 px-4 rounded-md ${activeComponent === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveComponent('addProduct')}
          className={`py-2 px-4 rounded-md ${activeComponent === 'addProduct' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Add Product
        </button>
      </div>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
}
