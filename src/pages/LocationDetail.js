import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, FolderPlus } from 'lucide-react';
import { api } from '../services/api';
import Header from '../components/Header';

export const LocationDetail = () => {
  const { locationId, systemId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('measure');
  const [content, setContent] = useState([]);
  const [folders, setFolders] = useState([]);
  const [openFolders, setOpenFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const [contentData, foldersData] = await Promise.all([
        api.getLocationContent(locationId, activeTab),
        api.getLocationFolders(locationId, activeTab)
      ]);
      setContent(contentData);
      setFolders(foldersData);
      setError(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  }, [locationId, activeTab]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleDelete = async (contentId, e) => {
    e.preventDefault();
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

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
  };

  const handleCreateFolder = async () => {
    try {
      await api.createFolder(locationId, {
        name: newFolderName,
        type: activeTab,
        order: folders.length
      });
      setNewFolderName('');
      setShowNewFolderModal(false);
      loadContent();
    } catch (error) {
      setError('Erreur lors de la création du dossier');
    }
  };

  const toggleFolder = (folderId) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleMoveContent = async (contentId, folderId) => {
    try {
      await api.moveContent(contentId, folderId);
      loadContent();
    } catch (error) {
      setError('Erreur lors du déplacement de la fiche');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Détails de la localisation" showBack={true} />
      
      {/* Tabs en dessous du header */}
      <div className="fixed top-[calc(4rem+env(safe-area-inset-top))] left-0 right-0 bg-white z-40">
        <div className="tabs flex border-b overflow-x-auto">
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
        
        {/* Barre de recherche */}
        <div className="p-4 bg-white border-b">
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
      </div>

      {/* Spacer pour le header fixe + tabs + search */}
      <div className="h-[calc(8rem+env(safe-area-inset-top)+3.5rem)]" />

      <div className="p-4">
        {/* Bouton pour créer un nouveau dossier */}
        <button
          onClick={() => setShowNewFolderModal(true)}
          className="mb-4 flex items-center gap-2 text-[#4f5b93] hover:text-[#3f4973]"
        >
          <FolderPlus size={20} />
          <span>Nouveau dossier</span>
        </button>

        {/* Liste des dossiers et leur contenu */}
        {folders.map(folder => (
          <div key={folder._id} className="mb-4 bg-white rounded-lg shadow">
            <button
              onClick={() => toggleFolder(folder._id)}
              className="w-full px-4 py-3 flex justify-between items-center text-left"
            >
              <span className="font-semibold text-[#4f5b93]">{folder.name}</span>
              {openFolders[folder._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openFolders[folder._id] && (
              <div className="p-4 border-t">
                {content
                  .filter(item => item.folderId === folder._id)
                  .map(item => (
                    <ContentItem
                      key={item._id}
                      item={item}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onClick={() => handleViewContent(item._id)}
                      folders={folders}
                      onMove={handleMoveContent}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Contenu sans dossier */}
        <div className="mb-4">
          <h3 className="text-gray-500 mb-2">Sans dossier</h3>
          {content
            .filter(item => !item.folderId)
            .map(item => (
              <ContentItem
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onClick={() => handleViewContent(item._id)}
                folders={folders}
                onMove={handleMoveContent}
              />
            ))}
        </div>
      </div>

      {/* Modal pour créer un nouveau dossier */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouveau dossier</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du dossier"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-[#4f5b93] text-white rounded hover:bg-[#3f4973]"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'ajout principal */}
      <button
        onClick={() => navigate(`/system/${systemId}/location/${locationId}/content/${activeTab}`)}
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 bg-[#4f5b93] text-white rounded-full p-4 shadow-lg hover:bg-[#3f4973] transition-colors z-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

// Composant pour un élément de contenu
const ContentItem = ({ item, onDelete, onEdit, onClick, folders, onMove }) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-2 hover:shadow-lg transition-shadow relative">
      <div className="flex justify-between items-center gap-2" onClick={onClick}>
        <h3 className="text-lg font-semibold text-[#4f5b93] truncate flex-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMoveMenu(!showMoveMenu);
            }}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <FolderPlus size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item._id, e);
            }}
            className="p-2 text-blue-500 hover:text-blue-700"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id, e);
            }}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Menu pour déplacer vers un dossier */}
      {showMoveMenu && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20">
          {folders.map(folder => (
            <button
              key={folder._id}
              onClick={(e) => {
                e.stopPropagation();
                onMove(item._id, folder._id);
                setShowMoveMenu(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {folder.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationDetail;