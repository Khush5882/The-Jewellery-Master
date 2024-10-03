// Toast.js
import React from 'react';

const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
      <button onClick={onClose} className="absolute top-1 right-1 text-white">
        &times;
      </button>
      {message}
    </div>
  );
};

export default Toast;
