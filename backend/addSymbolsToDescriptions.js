const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON
const jsonFilePath = path.join(__dirname, 'data', 'picturePhotoAlbum.json');

// Fonction pour remplacer les mots par des symboles
function addSymbolsToDescriptions() {
    try {
        // Lire le fichier JSON
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        const pictures = JSON.parse(data);

        // Dictionnaire de remplacement
        const symbolReplacements = {
            'Filtres On': 'Filtres 🔽',
            'Filtres Off': 'Filtres 🔼',
            'boutton >': 'bouton ▶️',
            'bouton >': 'bouton ▶️',
            'bouton <': 'bouton ◀️',
            'suivant': 'suivant ▶️',
            'précédent': 'précédent ◀️',
            'navigation': 'navigation 🧭',
            'recherche': 'recherche 🔍',
            'paramètres': 'paramètres ⚙️',
            'tags': 'tags 🏷️',
            'filtre': 'filtre 🔽',
            'zoom': 'zoom 🔍'
        };

        // Modifier chaque description
        pictures.forEach(picture => {
            if (picture.imageDescription) {
                let newDescription = picture.imageDescription;
                
                // Appliquer tous les remplacements
                Object.keys(symbolReplacements).forEach(oldText => {
                    const newText = symbolReplacements[oldText];
                    // Remplacement insensible à la casse
                    const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    newDescription = newDescription.replace(regex, newText);
                });
                
                picture.imageDescription = newDescription;
            }
        });

        // Sauvegarder le fichier modifié
        fs.writeFileSync(jsonFilePath, JSON.stringify(pictures, null, 4), 'utf8');
        
        console.log('✅ Symboles ajoutés avec succès !');
        console.log(`📊 ${pictures.length} images traitées`);
        
        // Afficher quelques exemples de modifications
        const modifiedDescriptions = pictures
            .filter(p => p.imageDescription && (p.imageDescription.includes('🔽') || p.imageDescription.includes('▶️')))
            .slice(0, 3);
            
        if (modifiedDescriptions.length > 0) {
            console.log('\n📝 Exemples de descriptions modifiées :');
            modifiedDescriptions.forEach(p => {
                console.log(`- Image ${p.imageId}: "${p.imageDescription}"`);
            });
        }

    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout des symboles:', error.message);
    }
}

// Exécuter la fonction
addSymbolsToDescriptions();
