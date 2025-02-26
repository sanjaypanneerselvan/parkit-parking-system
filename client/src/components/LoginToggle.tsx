import React from 'react';

interface LoginToggleProps {
  isAdmin: boolean;
  onToggle: (value: boolean) => void;
}

export const LoginToggle: React.FC<LoginToggleProps> = ({ isAdmin, onToggle }) => {
  return (
    <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
          !isAdmin ? 'bg-white shadow-md' : 'hover:bg-gray-300'
        }`}
      >
        User
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
          isAdmin ? 'bg-white shadow-md' : 'hover:bg-gray-300'
        }`}
      >
        Admin
      </button>
    </div>
  );
};