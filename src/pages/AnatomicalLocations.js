import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import Header from '../components/Header';

export const AnatomicalLocations = () => {
  const { systemId } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLocations();
  }, [systemId]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      console.log('Loading locations for systemId:', systemId);
      const locationsData = await api.getLocations(systemId);
      console.log('Loaded locations:', locationsData);
      
      if (!Array.isArray(locationsData)) {
        console.error('Les données reçues ne sont pas un tableau:', locationsData);
        setError('Format de données invalide');
        return;
      }
      
      setLocations(locationsData);
      setError(null);
    } catch (error) {
      console.error('Erreur dans loadLocations:', error);
      setError('Impossible de charger les localisations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (locationId, e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vraiment supprimer cette localisation ?')) {
      try {
        setLoading(true);
        await api.deleteLocation(locationId);
        await loadLocations();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Localisations" showBack={true} />
      
      {/* Barre de recherche fixe sous le header */}
      <div className="fixed top-[calc(4rem+env(safe-area-inset-top))] left-0 right-0 bg-white z-40 border-b">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une localisation..."
              className="w-full p-2 pl-10 rounded-lg border border-gray-300"
            />
          </div>
        </div>
      </div>
  
      {/* Spacer pour le header fixe + search */}
      <div className="h-[calc(8rem+env(safe-area-inset-top))]" />
  
      <div className="p-4">
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
            {locations.length === 0 && !error ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Aucune localisation trouvée</p>
                <p className="text-sm text-gray-400 mt-2">
                  Cliquez sur le + pour en ajouter une
                </p>
              </div>
            ) : (
              locations
                .filter(location => 
                  location.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((location) => (
                  <div 
                    key={location._id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative"
                  >
                    <Link to={`/system/${systemId}/location/${location._id}`}>
                      <h2 className="text-lg font-semibold text-[#4f5b93] pr-8">
                        {location.name}
                      </h2>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(location._id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
  
      <button
        onClick={() => navigate(`/add-folder/location/${systemId}`)}
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 bg-[#4f5b93] text-white rounded-full p-4 shadow-lg hover:bg-[#3f4973] transition-colors z-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AnatomicalLocations;