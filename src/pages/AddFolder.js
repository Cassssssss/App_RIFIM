import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
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

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Header 
        title={`Ajouter ${type === 'system' ? 'un système' : 'une localisation'}`}
        showBack={true}
      />

      {/* Spacer pour compenser le header fixe */}
      <div className="h-[calc(4rem+env(safe-area-inset-top))]" />

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

export default AddFolder;