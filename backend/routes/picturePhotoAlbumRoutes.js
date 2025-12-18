const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Route pour récupérer toutes les images du photo album
router.get('/', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/picturePhotoAlbum.json');
        
        // Vérifier si le fichier existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                error: 'Photo album data not found',
                message: 'Le fichier picturePhotoAlbum.json n\'existe pas'
            });
        }

        // Lire le fichier
        const rawData = fs.readFileSync(filePath, 'utf8');
        const photoAlbumData = JSON.parse(rawData);

        // Optionnel: filtrer par catégorie si spécifié dans les paramètres de requête
        const { category, subCategory } = req.query;
        
        let filteredData = photoAlbumData;
        
        if (category || subCategory) {
            filteredData = photoAlbumData.filter(image => {
                if (category && !subCategory) {
                    // Filtrer par catégorie seulement
                    return image.tags[category] && image.tags[category].length > 0;
                } else if (category && subCategory) {
                    // Filtrer par catégorie et sous-catégorie
                    return image.tags[category] && image.tags[category].includes(subCategory);
                }
                return true;
            });
        }

        res.json(filteredData);
        
    } catch (error) {
        console.error('Error reading photo album data:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Erreur lors de la lecture des données du photo album'
        });
    }
});

// Route pour récupérer une image spécifique par ID
router.get('/:imageId', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/picturePhotoAlbum.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const photoAlbumData = JSON.parse(rawData);
        
        const imageId = parseInt(req.params.imageId);
        const image = photoAlbumData.find(img => img.imageId === imageId);
        
        if (!image) {
            return res.status(404).json({ 
                error: 'Image not found',
                message: `Image avec l'ID ${imageId} non trouvée`
            });
        }
        
        res.json(image);
        
    } catch (error) {
        console.error('Error reading specific image data:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Erreur lors de la lecture des données de l\'image'
        });
    }
});

module.exports = router;
