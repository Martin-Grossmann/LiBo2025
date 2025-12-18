const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON
const jsonFilePath = path.join(__dirname, 'data', 'picturePhotoAlbum.json');

function updateZoomForImageRange() {
    try {
        // Lire le fichier JSON
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        const pictures = JSON.parse(data);

        let modifiedCount = 0;
        let alreadyCorrectCount = 0;

        // Parcourir toutes les images
        pictures.forEach(picture => {
            // Vérifier si l'imageId est dans la plage 322-874
            if (picture.imageId >= 322 && picture.imageId <= 874) {
                if (picture.zoom !== 0.85) {
                    picture.zoom = 0.85;
                    modifiedCount++;
                } else {
                    alreadyCorrectCount++;
                }
            }
        });

        // Sauvegarder le fichier modifié seulement si des modifications ont été faites
        if (modifiedCount > 0) {
            fs.writeFileSync(jsonFilePath, JSON.stringify(pictures, null, 4), 'utf8');
            console.log('✅ Zoom mis à jour avec succès !');
        } else {
            console.log('✅ Toutes les images ont déjà le bon zoom !');
        }
        
        console.log(`📊 Images dans la plage 322-874:`);
        console.log(`   - Images modifiées: ${modifiedCount}`);
        console.log(`   - Images déjà correctes: ${alreadyCorrectCount}`);
        console.log(`   - Total vérifié: ${modifiedCount + alreadyCorrectCount}`);
        
        // Vérifier quelques exemples
        const examples = pictures
            .filter(p => p.imageId >= 322 && p.imageId <= 874)
            .filter((p, index) => index % 100 === 0) // Prendre un échantillon tous les 100
            .slice(0, 5);
            
        if (examples.length > 0) {
            console.log('\n📝 Échantillon de vérification :');
            examples.forEach(example => {
                console.log(`   - Image ${example.imageId} (${example.imageName}): zoom = ${example.zoom}`);
            });
        }

    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du zoom:', error.message);
    }
}

// Exécuter la fonction
updateZoomForImageRange();
