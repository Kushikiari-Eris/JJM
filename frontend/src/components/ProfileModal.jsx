// ProfileModal.js
import React from 'react';

const ProfileModal = ({ isOpen, onClose,  }) => {
  if (!isOpen) return null; // Return null if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold">User Profile</h2>
        <div className="mt-4">
          <p><strong>Name:</strong> </p>
          <p><strong>Email:</strong> </p>
          <p><strong>Role:</strong> </p>
          {/* Add more user data fields as needed */}
        </div>
        <div className="mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



export default ProfileModal;
