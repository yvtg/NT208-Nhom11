import React, { useEffect } from 'react';
import { FaBell } from 'react-icons/fa';

const MessageNotify = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Tự động đóng sau 5 giây

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 animate-slide-up">
      <FaBell className="text-blue-500 text-xl" />
      <div>
        <p className="font-medium text-gray-800">Tin nhắn mới</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
};

export default MessageNotify; 