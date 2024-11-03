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
        
        {/* Header principal */}
        <div className="bg-[#4f5b93] text-white">
          <div className="h-16 flex items-center px-4">
            {showBack && (
              <button 
                onClick={() => navigate(-1)}
                className="mr-3"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>
      </div>
      
      {/* Spacer pour compenser le header fixe */}
      <div className="h-[calc(4rem+env(safe-area-inset-top))]" />
    </>
  );
};

export default Header;