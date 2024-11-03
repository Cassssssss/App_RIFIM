// backend/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const System = require('../models/System');
const Location = require('../models/Location');
const Content = require('../models/Content');

// Configuration DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: "lon1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
  }
});

// Upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// Routes pour les systèmes
router.get('/systems', async (req, res) => {
  try {
    const systems = await System.find();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/systems', async (req, res) => {
  try {
    const system = new System({
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    await system.save();
    res.status(201).json(system);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/systems/:systemId', async (req, res) => {
  try {
    await System.findByIdAndDelete(req.params.systemId);
    await Location.deleteMany({ systemId: req.params.systemId });
    res.json({ message: 'Système supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes pour les localisations
router.get('/systems/:systemId/locations', async (req, res) => {
  try {
    const locations = await Location.find({ systemId: req.params.systemId });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/systems/:systemId/locations', async (req, res) => {
  try {
    const location = new Location({
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
      systemId: req.params.systemId
    });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/locations/:locationId', async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.locationId);
    await Content.deleteMany({ locationId: req.params.locationId });
    res.json({ message: 'Localisation supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes pour le contenu
router.get('/locations/:locationId/content/:type', async (req, res) => {
  try {
    const content = await Content.find({
      locationId: req.params.locationId,
      type: req.params.type
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nouvelle route pour obtenir un contenu spécifique
router.get('/content/:contentId', async (req, res) => {
    try {
      console.log('Backend: received request for content:', req.params.contentId);
      console.log('Request headers:', req.headers);
      
      const content = await Content.findById(req.params.contentId);
      console.log('Found content:', content ? 'yes' : 'no', content ? content : '');
      
      if (!content) {
        console.log('Content not found');
        return res.status(404).json({ 
          error: 'Contenu non trouvé',
          contentId: req.params.contentId 
        });
      }
  
      console.log('Sending content back to client');
      res.json(content);
    } catch (error) {
      console.error('Backend error details:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ error: error.message });
    }
  });

router.post('/locations/:locationId/content', upload.array('images'), async (req, res) => {
  try {
    const { locationId } = req.params;
    const { title, type, description } = req.body;

    console.log('Received content creation request:', {
      locationId,
      title,
      type,
      description,
      files: req.files?.length || 0
    });

    const locationExists = await Location.findById(locationId);
    if (!locationExists) {
      return res.status(404).json({ error: 'Localisation non trouvée' });
    }

    const images = await Promise.all((req.files || []).map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype
      });

      await s3Client.send(command);
      return {
        url: `${process.env.SPACES_ENDPOINT}/${process.env.SPACES_BUCKET}/${fileName}`,
        caption: file.originalname
      };
    }));

    const content = new Content({
      title,
      type,
      description,
      images,
      locationId
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Nouvelle route pour mettre à jour un contenu
router.put('/content/:contentId', upload.array('images'), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const existingContent = await Content.findById(req.params.contentId);

    if (!existingContent) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }

    // Gérer les nouvelles images si présentes
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(req.files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const command = new PutObjectCommand({
          Bucket: process.env.SPACES_BUCKET,
          Key: fileName,
          Body: file.buffer,
          ACL: "public-read",
          ContentType: file.mimetype
        });

        await s3Client.send(command);
        return {
          url: `${process.env.SPACES_ENDPOINT}/${process.env.SPACES_BUCKET}/${fileName}`,
          caption: file.originalname
        };
      }));
    }

    // Combiner les images existantes avec les nouvelles
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const updatedImages = [...existingImages, ...newImages];

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.contentId,
      {
        title,
        description,
        type,
        images: updatedImages
      },
      { new: true }
    );

    res.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/content/:contentId', async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.contentId);
    res.json({ message: 'Fiche supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;