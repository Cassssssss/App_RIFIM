import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Header = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.pathname;
    
    if (path.includes('/add-folder/location/')) {
      // Retour à la page du système parent
      const systemId = path.split('/add-folder/location/')[1];
      navigate(`/system/${systemId}`);
    } else if (path.includes('/content/')) {
      // Si on est dans une fiche, retour à la liste des fiches
      const baseUrl = path.split('/content/')[0];
      navigate(baseUrl);
    } else if (path.includes('/location/')) {
      // Si on est dans une localisation, retour au système
      const systemId = path.split('/system/')[1]?.split('/')[0];
      navigate(`/system/${systemId}`);
    } else if (path.includes('/system/')) {
      // Si on est dans un système, retour à la liste des systèmes
      navigate('/');
    } else {
      // Fallback
      navigate(-1);
    }
  };

return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Safe area spacer plus petit */}
      <div 
        className="w-full h-[env(safe-area-inset-top)] bg-[#4f5b93]" 
        style={{ minHeight: 'env(safe-area-inset-top)' }}
      />
      
      {/* Header content plus compact */}
      <div className="bg-[#4f5b93] text-white">
        <div className="h-14 flex items-center px-3"> {/* Hauteur réduite et padding ajusté */}
          <div className="flex items-center flex-1 min-h-[3.5rem]">
            {showBack && (
              <button 
                onClick={handleBack}
                className="mr-2 -ml-1 p-2"
              >
                <ChevronLeft size={22} /> {/* Taille d'icône réduite */}
              </button>
            )}
            
            <h1 className="text-lg font-semibold truncate"> {/* Taille de texte réduite */}
              {title}
            </h1>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="text-white font-semibold hover:text-gray-200 transition-colors text-sm"
          >
            RIFIM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;