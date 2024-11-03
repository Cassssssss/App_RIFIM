const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
console.log('Configuration API:', {
  API_URL,
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL
});

export const api = {
    getSystems: async () => {
      console.log('🔵 Début getSystems');
      try {
        console.log('📡 Tentative de connexion à:', `${API_URL}/systems`);
        const response = await fetch(`${API_URL}/systems`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Ajout des headers CORS explicites
            'Origin': window.location.origin
          },
          mode: 'cors' // Forcer le mode CORS
        });
  
        console.log('📥 Réponse reçue:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        });
  
        if (!response.ok) {
          console.log('❌ Réponse non OK');
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Données reçues:', data);
        return data;
      } catch (error) {
        console.log('🔴 Erreur dans getSystems:', {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name
        });
        return [];
      }
    },

  createSystem: async (name) => {
    try {
      const response = await fetch(`${API_URL}/systems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Erreur lors de la création du système');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  deleteSystem: async (systemId) => {
    try {
      const response = await fetch(`${API_URL}/systems/${systemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du système');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  // Localisations
  getLocations: async (systemId) => {
    try {
      const response = await fetch(`${API_URL}/systems/${systemId}/locations`);
      if (!response.ok) throw new Error('Erreur lors du chargement des localisations');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  },

  createLocation: async (systemId, name) => {
    try {
      const response = await fetch(`${API_URL}/systems/${systemId}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Erreur lors de la création de la localisation');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  deleteLocation: async (locationId) => {
    try {
      const response = await fetch(`${API_URL}/locations/${locationId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de la localisation');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  // Contenu
  getLocationContent: async (locationId, type) => {
    try {
      console.log('Fetching content:', { locationId, type });
      const response = await fetch(`${API_URL}/locations/${locationId}/content/${type}`);
      if (!response.ok) {
        console.error('Response status:', response.status);
        throw new Error('Erreur lors du chargement du contenu');
      }
      const data = await response.json();
      console.log('Content received:', data);
      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  },

  createContent: async (locationId, formData) => {
    try {
      console.log('API createContent called with exact locationId:', locationId);
      console.log('locationId type:', typeof locationId);
      
      if (!locationId || locationId === 'undefined' || locationId === undefined) {
        throw new Error('ID de localisation invalide');
      }
  
      const response = await fetch(`${API_URL}/locations/${locationId}/content`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du contenu');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
        console.error('Erreur API détaillée:', error);
        throw error;
      }
  },

  getContent: async (contentId) => {
    try {
      console.log('Frontend API: Starting request to:', `${API_URL}/content/${contentId}`);
      console.log('API_URL value:', API_URL);
      
      const response = await fetch(`${API_URL}/content/${contentId}`);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
      
      const text = await response.text(); // D'abord récupérer le texte brut
      console.log('Raw response:', text);
      
      let data;
      try {
        data = JSON.parse(text); // Ensuite parser en JSON
      } catch (e) {
        console.error('JSON parse error:', e);
        console.error('Received content:', text.substring(0, 500)); // Afficher le début du contenu
        throw e;
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement du contenu');
      }
      
      return data;
    } catch (error) {
      console.error('Complete error details:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  // Upload d'images
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de l\'upload de l\'image');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  deleteContent: async (contentId) => {
    try {
      const response = await fetch(`${API_URL}/content/${contentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du contenu');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },


  updateContent: async (contentId, formData) => {
    try {
      const response = await fetch(`${API_URL}/content/${contentId}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du contenu');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  
  
};

export default api;