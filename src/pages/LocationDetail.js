// src/pages/LocationDetail.js
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronLeft, Trash2, Edit } from 'lucide-react';
import { api } from '../services/api';

export const LocationDetail = () => {
  const { locationId, systemId } = useParams();
  console.log('LocationDetail Params:', { locationId, systemId }); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('measure');
  const [content, setContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContent = useCallback(async () => {
    if (!locationId) {
      setError('ID de localisation manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getLocationContent(locationId, activeTab);
      setContent(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement du contenu');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [locationId, activeTab]);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async (contentId, e) => {
    e.stopPropagation(); // Empêche la navigation lors du clic sur supprimer
    if (!contentId) {
      console.error('ID de contenu manquant');
      return;
    }
  
    if (window.confirm('Voulez-vous vraiment supprimer cette fiche ?')) {
      try {
        await api.deleteContent(contentId);
        await loadContent();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de la fiche');
      }
    }
  };

  const handleEdit = (contentId, e) => {
    e.stopPropagation(); // Empêche la navigation lors du clic sur éditer
    console.log('Navigating to edit with params:', {
      systemId,
      locationId,
      activeTab,
      contentId
    });
    
    if (!contentId || !locationId || !systemId || !activeTab) {
      console.error('Missing required params:', {
        contentId,
        locationId,
        systemId,
        activeTab
      });
      return;
    }
  
    const editUrl = `/system/${systemId}/location/${locationId}/content/${activeTab}/edit/${contentId}`;
    console.log('Edit URL:', editUrl);
    navigate(editUrl);
  };

  const handleBack = () => {
    navigate(`/system/${systemId}`);
  };

  const handleViewContent = (contentId) => {
    navigate(`/system/${systemId}/location/${locationId}/content/${activeTab}/${contentId}/view`);
  };
  

  if (!locationId || !systemId) {
    return (
      <div className="p-4 text-red-600">
        Erreur: Paramètres manquants
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <div className="bg-[#4f5b93] text-white p-4 flex items-center sticky top-0 z-50">
    <button onClick={handleBack} className="mr-4">
      <ChevronLeft size={24} />
    </button>
    <h1 className="text-xl font-semibold truncate">Détails de la localisation</h1>
  </div>

  {/* Tabs - Ajout de scroll horizontal sur mobile */}
  <div className="flex border-b overflow-x-auto sticky top-16 bg-white z-40">
    <button
      className={`flex-none min-w-[50%] py-3 px-4 ${
        activeTab === 'measure' ? 'border-b-2 border-[#4f5b93] text-[#4f5b93]' : 'text-gray-500'
      }`}
      onClick={() => handleTabChange('measure')}
    >
      Repères & Mesures
    </button>
    <button
      className={`flex-none min-w-[50%] py-3 px-4 ${
        activeTab === 'classification' ? 'border-b-2 border-[#4f5b93] text-[#4f5b93]' : 'text-gray-500'
      }`}
      onClick={() => handleTabChange('classification')}
    >
      Classifications
    </button>
  </div>

  <div className="p-2 sm:p-4">
    {/* Search Bar - Optimisée pour mobile */}
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher une fiche..."
        className="w-full p-2 pl-10 rounded-lg border border-gray-300 text-base"
      />
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
        {error}
      </div>
    )}

    {/* Content Cards */}
    <div className="grid gap-3">
      {content
        .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => (
          <div 
            key={item._id} 
            className="bg-white rounded-lg shadow p-3 sm:p-4 relative hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center gap-2">
              <h3 
                onClick={() => handleViewContent(item._id)}
                className="text-base sm:text-lg font-semibold text-[#4f5b93] cursor-pointer hover:text-[#3f4973] truncate flex-1"
              >
                {item.title}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={(e) => handleEdit(item._id, e)}
                  className="p-2 text-blue-500 hover:text-blue-700"
                  aria-label="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => handleDelete(item._id, e)}
                  className="p-2 text-red-500 hover:text-red-700"
                  aria-label="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>

  {/* Add Button - Optimisé pour mobile */}
  <button
    onClick={() => {
      if (!locationId) return;
      navigate(`/system/${systemId}/location/${locationId}/content/${activeTab}`);
    }}
    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#4f5b93] text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-[#3f4973] transition-colors z-50"
  >
    <Plus size={24} />
  </button>
</div>
  );
};

export default LocationDetail;