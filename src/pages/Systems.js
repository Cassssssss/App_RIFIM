// src/pages/Systems.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      const data = await api.getSystems();
      setSystems(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (systemId, e) => {
    e.preventDefault(); // Empêche la navigation
    if (window.confirm('Voulez-vous vraiment supprimer ce système ?')) {
      try {
        await api.deleteSystem(systemId);
        loadSystems(); // Recharge la liste
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div>
      <div className="bg-[#4f5b93] text-white p-4">
        <h1 className="text-xl font-semibold">Systèmes radiologiques</h1>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un système..."
            className="w-full p-2 pl-10 rounded-lg border border-gray-300"
          />
        </div>

        <div className="grid gap-4">
          {systems
            .filter(system => system.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((system) => (
              <div key={system._id} 
                   className="block bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative">
                <Link to={`/system/${system._id}`} className="block">
                  <h2 className="text-lg font-semibold text-[#4f5b93]">{system.name}</h2>
                </Link>
                <button
                  onClick={(e) => handleDelete(system._id, e)}
                  className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/add-folder/system')}
        className="fixed bottom-6 right-6 bg-[#4f5b93] text-white rounded-full p-4 shadow-lg hover:bg-[#3f4973] transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};