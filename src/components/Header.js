import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Menu } from 'lucide-react';

export const Header = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary text-white p-4 flex items-center">
      {showBack && (
        <button onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-semibold flex-1">{title}</h1>
      <Menu size={24} />
    </div>
  );
};