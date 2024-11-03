const API_URL = '/api'; 

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};


export const api = {
  getSystems: async () => {
    console.log('🔵 Début getSystems');
    try {
      console.log('📡 Tentative de connexion à:', `${API_URL}/systems`);
      const response = await fetch(`${API_URL}/systems`, {
        method: 'GET',
        headers: defaultHeaders,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('🔴 Erreur dans getSystems:', error);
      return [];
    }
  },

  createSystem: async (name) => {
    try {
      const response = await fetch(`${API_URL}/systems`, {
        method: 'POST',
        headers: defaultHeaders,
        mode: 'cors',
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
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du système');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  getLocations: async (systemId) => {
    try {
      const response = await fetch(`${API_URL}/systems/${systemId}/locations`, {
        headers: defaultHeaders,
        credentials: 'include'
      });
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
        headers: defaultHeaders,
        credentials: 'include',
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
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de la localisation');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  getLocationContent: async (locationId, type) => {
    try {
      console.log('Fetching content:', { locationId, type });
      const response = await fetch(`${API_URL}/locations/${locationId}/content/${type}`, {
        headers: defaultHeaders,
        credentials: 'include'
      });
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
      
      if (!locationId || locationId === 'undefined' || locationId === undefined) {
        throw new Error('ID de localisation invalide');
      }
  
      const response = await fetch(`${API_URL}/locations/${locationId}/content`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du contenu');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erreur API détaillée:', error);
      throw error;
    }
  },

  getContent: async (contentId) => {
    try {
      console.log('Frontend API: Starting request to:', `${API_URL}/content/${contentId}`);
      
      const response = await fetch(`${API_URL}/content/${contentId}`, {
        headers: defaultHeaders,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Complete error details:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
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
        headers: defaultHeaders,
        credentials: 'include'
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
        credentials: 'include',
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