import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api } from '../services/api';

export const AddFolder = () => {
  const navigate = useNavigate();
  const { systemId } = useParams();
  const [folderName, setFolderName] = useState('');
  const type = systemId ? 'location' : 'system';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'system') {
        await api.createSystem(folderName);
        navigate('/');
      } else {
        await api.createLocation(systemId, folderName);
        navigate(`/system/${systemId}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleBack = () => {
    if (type === 'system') {
      navigate('/');
    } else {
      navigate(`/system/${systemId}`);
    }
  };

  return (
    <div>
      <div className="bg-[#4f5b93] text-white p-4 flex items-center">
        <button onClick={handleBack} className="mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">
          Ajouter {type === 'system' ? 'un système' : 'une localisation'}
        </h1>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">Nom</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4f5b93]"
              placeholder={`Nom ${type === 'system' ? 'du système' : 'de la localisation'}`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4f5b93] text-white p-3 rounded hover:bg-[#3f4973] transition-colors"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
};