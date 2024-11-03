import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { api } from '../services/api';
import Header from '../components/Header';

export const AddContent = () => {
  const { systemId, locationId, type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    console.log('Current URL:', window.location.href);
    console.log('Location state:', location);
    console.log('URL Params:', { systemId, locationId, type });
    
    if (!systemId || !locationId || locationId === 'undefined' || !type) {
      console.error('Paramètres invalides:', { systemId, locationId, type });
      setError('Paramètres invalides');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
  }, [systemId, locationId, type, navigate, location]);

  useEffect(() => {
    return () => {
      // Cleanup preview URLs on unmount
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!locationId || locationId === 'undefined') {
      console.error('ID de localisation invalide:', locationId);
      setError('ID de localisation invalide');
      return;
    }

    if (!systemId) {
      console.error('ID du système invalide:', systemId);
      setError('ID du système invalide');
      return;
    }

    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', type);
      formDataToSend.append('locationId', locationId);
      
      if (formData.images && formData.images.length > 0) {
        Array.from(formData.images).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      console.log('Sending FormData with:', {
        locationId,
        type,
        title: formData.title
      });
      
      const result = await api.createContent(locationId, formDataToSend);
      console.log('Content created:', result);
      
      navigate(`/system/${systemId}/location/${locationId}`);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setError(error.message || 'Erreur lors de la création de la fiche');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validate each file
      const validFiles = Array.from(files).filter(file => {
        const isValid = file.type.startsWith('image/');
        if (!isValid) {
          setError(`Le fichier ${file.name} n'est pas une image valide`);
        }
        return isValid;
      });

      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: validFiles
        }));
        
        // Create and store preview URLs
        const urls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => {
          prev.forEach(url => URL.revokeObjectURL(url));
          return urls;
        });
      }
    }
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'clean'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  if (error && (!systemId || !locationId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
          <p className="mt-2">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={`Ajouter une fiche ${type === 'measure' ? 'de repères & mesures' : 'de classification'}`}
        showBack={true}
      />

      {/* Spacer pour le header fixe */}
      <div className="h-[calc(4rem+env(safe-area-inset-top))]" />

      <div className="p-2 sm:p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-[#4f5b93] focus:border-transparent"
                placeholder="Entrez le titre de la fiche"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Description</label>
              <div className="bg-white rounded-lg border">
                <ReactQuill 
                  ref={quillRef}
                  value={formData.description}
                  onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                  modules={quillModules}
                  theme="snow"
                  className="h-48 sm:h-64 mb-12"
                  placeholder="Entrez la description détaillée..."
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Images</label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg text-sm sm:text-base"
              />
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-video">
                      <img
                        src={url}
                        alt={`Aperçu ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 sm:p-4">
              <div className="max-w-4xl mx-auto flex gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/system/${systemId}/location/${locationId}`)}
                  className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-[#4f5b93] text-white p-3 rounded-lg hover:bg-[#3f4973] transition-colors text-sm sm:text-base
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Création en cours...' : 'Créer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContent;