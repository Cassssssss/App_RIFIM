import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Header = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Safe area spacer pour iOS */}
        <div className="w-full h-[env(safe-area-inset-top)] bg-[#4f5b93]" />
        
        {/* Contenu du header */}
        <div className="bg-[#4f5b93] text-white px-4 h-14 flex items-center">
          {showBack && (
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 -ml-2"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          <h1 className="text-xl font-semibold flex-1">
            {title}
          </h1>
        </div>
      </div>
      
      {/* Spacer pour compenser le header fixe */}
      <div className="h-[calc(3.5rem+env(safe-area-inset-top))]" />
    </>
  );
};

export default Header;