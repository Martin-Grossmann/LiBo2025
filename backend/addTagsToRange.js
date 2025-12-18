const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON
const jsonFilePath = path.join(__dirname, 'data', 'picturePhotoAlbum.json');

function addTagsAndZoomToImages() {
    try {
        // Lire le fichier JSON
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        const pictures = JSON.parse(data);

        // Définir la structure à ajouter
        const tagsStructure = {
            "En Mer": [],
            "Evénements": [],
            "Escales": [],
            "Equipage": [],
            "Monuments": []
        };

        let modifiedCount = 0;

        // Parcourir toutes les images
        pictures.forEach(picture => {
            // Vérifier si l'imageId est dans la plage 322-874
            if (picture.imageId >= 322 && picture.imageId <= 874) {
                // Ajouter ou remplacer la structure tags
                picture.tags = tagsStructure;
                
                // Ajouter ou remplacer le zoom
                picture.zoom = 0.85;
                
                modifiedCount++;
            }
        });

        // Sauvegarder le fichier modifié
        fs.writeFileSync(jsonFilePath, JSON.stringify(pictures, null, 4), 'utf8');
        
        console.log('✅ Tags et zoom ajoutés avec succès !');
        console.log(`📊 ${modifiedCount} images modifiées (imageId: 322-874)`);
        
        // Vérifier quelques exemples
        const examples = pictures
            .filter(p => p.imageId >= 322 && p.imageId <= 324)
            .map(p => ({
                id: p.imageId,
                name: p.imageName,
                hasTagsStructure: p.tags && Object.keys(p.tags).length === 5,
                zoom: p.zoom
            }));
            
        console.log('\n📝 Exemples de modifications :');
        examples.forEach(example => {
            console.log(`- Image ${example.id} (${example.name}): Tags structure: ${example.hasTagsStructure ? '✅' : '❌'}, Zoom: ${example.zoom}`);
        });

    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout des tags et zoom:', error.message);
    }
}

// Exécuter la fonction
addTagsAndZoomToImages();
