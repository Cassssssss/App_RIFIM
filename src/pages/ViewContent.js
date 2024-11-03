import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export const ViewContent = () => {
  const { systemId, locationId, contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.getContent(contentId);
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
        setError('Erreur lors du chargement de la fiche');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId]);

  const handleBack = () => {
    navigate(`/system/${systemId}/location/${locationId}`);
  };

  const handleEdit = () => {
    navigate(`/system/${systemId}/location/${locationId}/content/${content.type}/edit/${contentId}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette fiche ?')) {
      try {
        await api.deleteContent(contentId);
        navigate(`/system/${systemId}/location/${locationId}`);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de la fiche');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-lg sm:text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error || 'Fiche non trouvée'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Safe area spacer pour iOS */}
        <div className="w-full h-[env(safe-area-inset-top)] bg-[#4f5b93]" />
        
        {/* Header principal */}
        <div className="bg-[#4f5b93] text-white">
          <div className="h-16 flex items-center px-4 justify-between">
            <div className="flex items-center flex-1">
              <button onClick={handleBack} className="mr-3">
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-semibold truncate">
                {content.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-[#3f4973] rounded-full transition-colors"
                aria-label="Modifier"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-[#3f4973] rounded-full transition-colors"
                aria-label="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer pour le header fixe */}
      <div className="h-[calc(4rem+env(safe-area-inset-top))]" />

      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          {content.description && (
            <div 
              className="text-gray-700 prose prose-sm sm:prose-base lg:prose-lg max-w-none ql-editor"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          )}
          
          {content.images && content.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {content.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                  />
                  {image.caption && (
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .ql-editor {
          padding: 0;
        }
        .ql-editor h1 {
          font-size: 1.75em;
          font-weight: bold;
          margin-bottom: 0.5em;
          color: #2d3748;
        }
        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
          color: #2d3748;
        }
        .ql-editor p {
          margin-bottom: 1em;
          line-height: 1.6;
        }
        .ql-editor ul, .ql-editor ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .ql-editor ul li {
          list-style-type: disc;
          margin-bottom: 0.5em;
        }
        .ql-editor ol li {
          list-style-type: decimal;
          margin-bottom: 0.5em;
        }
        .ql-editor strong {
          font-weight: 600;
        }
        .ql-editor em {
          font-style: italic;
        }
        .ql-editor blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1em;
          margin: 1em 0;
          color: #4a5568;
        }
        @media (max-width: 640px) {
          .ql-editor h1 {
            font-size: 1.5em;
          }
          .ql-editor h2 {
            font-size: 1.25em;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewContent;