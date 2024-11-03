import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, AlertCircle, Loader } from 'lucide-react';
import { api } from '../services/api';
import Header from '../components/Header';

export const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSystems();
      setSystems(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Impossible de charger les systèmes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (systemId, e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vraiment supprimer ce système ?')) {
      try {
        setLoading(true);
        await api.deleteSystem(systemId);
        await loadSystems();
      } catch (error) {
        setError('Erreur lors de la suppression. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <Header title="Systèmes radiologiques" showBack={false} />

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

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={loadSystems}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin text-[#4f5b93]" size={32} />
          </div>
        ) : (
          <div className="grid gap-4 mb-20">
            {systems.length === 0 && !error ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Aucun système trouvé</p>
                <p className="text-sm text-gray-400 mt-2">
                  Cliquez sur le + pour en ajouter un
                </p>
              </div>
            ) : (
              systems
                .filter(system => 
                  system.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((system) => (
                  <div
                    key={system._id}
                    className="block bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative"
                  >
                    <Link to={`/system/${system._id}`} className="block">
                      <h2 className="text-lg font-semibold text-[#4f5b93]">
                        {system.name}
                      </h2>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(system._id, e)}
                      className="absolute right-4 top-4 text-red-500 hover:text-red-700 transition-colors"
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
        onClick={() => navigate('/add-folder/system')}
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 bg-[#4f5b93] text-white rounded-full p-4 shadow-lg hover:bg-[#3f4973] transition-colors disabled:opacity-50"
        disabled={loading}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Systems;