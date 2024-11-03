// src/pages/EditContent.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../services/api';

export const EditContent = () => {
  const { systemId, locationId, type, contentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    console.log('EditContent mounted with params:', { systemId, locationId, type, contentId });
    console.log('Current location:', location);

    if (!contentId || !locationId || !systemId || !type) {
      console.error('Missing required params:', {
        contentId,
        locationId,
        systemId,
        type
      });
      setError('Paramètres manquants');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [contentId, locationId, systemId, type, navigate, location]);

  useEffect(() => {
    const loadExistingContent = async () => {
      try {
        console.log('Loading content data with ID:', contentId);
        const data = await api.getContent(contentId);
        console.log('Content data loaded:', data);
        
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            images: []
          });
          setExistingImages(data.images || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Erreur lors du chargement du contenu');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      loadExistingContent();
    }
  }, [contentId]);

  useEffect(() => {
    return () => {
      // Cleanup preview URLs on unmount
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!locationId || !contentId) {
      setError('Paramètres manquants');
      return;
    }

    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', type);
      formDataToSend.append('locationId', locationId);
      
      // Ajouter les nouvelles images
      if (formData.images && formData.images.length > 0) {
        Array.from(formData.images).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      // Ajouter les images existantes
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      console.log('Updating content with:', {
        contentId,
        title: formData.title,
        type,
        locationId
      });

      const result = await api.updateContent(contentId, formDataToSend);
      console.log('Content updated:', result);

      navigate(`/system/${systemId}/location/${locationId}`);
    } catch (error) {
      console.error('Error updating content:', error);
      setError(error.message || 'Erreur lors de la mise à jour');
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

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    navigate(`/system/${systemId}/location/${locationId}`);
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

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg sm:text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

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
      <div className="bg-[#4f5b93] text-white p-4 flex items-center sticky top-0 z-50">
        <button onClick={handleCancel} className="mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold truncate">
          Modifier la fiche {type === 'measure' ? 'de repères & mesures' : 'de classification'}
        </h1>
      </div>

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
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2">Images existantes</label>
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-1 sm:mt-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <img
                        src={image.url}
                        alt={image.caption || `Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="block text-gray-700 font-medium mt-4 mb-1 sm:mb-2">
                Ajouter de nouvelles images
              </label>
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
                        alt={`Nouvelle image ${index + 1}`}
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
                  onClick={handleCancel}
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
                  {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContent;