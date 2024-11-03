// src/pages/AnatomicalLocations.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, ChevronLeft, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export const AnatomicalLocations = () => {
  const { systemId } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [system, setSystem] = useState(null);

  useEffect(() => {
    loadLocations();
  }, [systemId]);

  const loadLocations = async () => {
    try {
      console.log('Loading locations for systemId:', systemId);
      const locationsData = await api.getLocations(systemId);
      console.log('Loaded locations:', locationsData);
      
      if (!Array.isArray(locationsData)) {
        console.error('Les données reçues ne sont pas un tableau:', locationsData);
        return;
      }
      
      setLocations(locationsData);
    } catch (error) {
      console.error('Erreur dans loadLocations:', error);
    }
  };

  const handleDelete = async (locationId, e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vraiment supprimer cette localisation ?')) {
      try {
        await api.deleteLocation(locationId);
        loadLocations();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div>
      <div className="bg-[#4f5b93] text-white p-4 flex items-center">
        <button onClick={() => navigate('/')} className="mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Localisations</h1>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une localisation..."
            className="w-full p-2 pl-10 rounded-lg border border-gray-300"
          />
        </div>

        <div className="grid gap-4">
          {locations
            .filter(location => location.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((location) => (
              <div 
                key={location._id}
                className="block bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative"
              >
                <Link to={`/system/${systemId}/location/${location._id}`}>
                  <h2 className="text-lg font-semibold text-[#4f5b93]">{location.name}</h2>
                </Link>
                <button
                  onClick={(e) => handleDelete(location._id, e)}
                  className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
        </div>
      </div>

      <button
        onClick={() => navigate(`/add-folder/location/${systemId}`)}
        className="fixed bottom-6 right-6 bg-[#4f5b93] text-white rounded-full p-4 shadow-lg hover:bg-[#3f4973] transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AnatomicalLocations;