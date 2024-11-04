import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import Header from '../components/Header';

export const LocationDetail = () => {
  const { locationId, systemId } = useParams();
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
    e.stopPropagation();
    if (!contentId) {
      console.error('ID de contenu manquant');
      return;
    }
  
    if (window.confirm('Voulez-vous vraiment supprimer cette fiche ?')) {
      try {
        setLoading(true);
        await api.deleteContent(contentId);
        await loadContent();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de la fiche');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (contentId, e) => {
    e.stopPropagation();
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
    navigate(editUrl);
  };

  const handleViewContent = (contentId) => {
    navigate(`/system/${systemId}/location/${locationId}/content/${activeTab}/${contentId}/view`);
  };

  if (!locationId || !systemId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-red-600">
          Erreur: Paramètres manquants
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <Header title="Détails de la localisation" showBack={true} />
    
    <div className="search-container">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une fiche..."
          className="w-full p-2 pl-10 rounded-lg border border-gray-300"
        />
      </div>
    </div>

    <div className="tabs flex border-b overflow-x-auto bg-white">
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

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une fiche..."
            className="w-full p-2 pl-10 rounded-lg border border-gray-300"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f5b93]"></div>
          </div>
        ) : (
          <div className="grid gap-4 mb-20">
            {content.length === 0 && !error ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Aucune fiche trouvée</p>
                <p className="text-sm text-gray-400 mt-2">
                  Cliquez sur le + pour en ajouter une
                </p>
              </div>
            ) : (
              content
                .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item) => (
                  <div 
                    key={item._id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative cursor-pointer"
                    onClick={() => handleViewContent(item._id)}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#4f5b93] truncate flex-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
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
                ))
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/system/${systemId}/location/${locationId}/content/${activeTab}`)}
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 bg-[#4f5b93] text-white rounded-full p-4 shadow-lg hover:bg-[#3f4973] transition-colors z-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default LocationDetail;