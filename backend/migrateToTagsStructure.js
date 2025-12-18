const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const currentDataPath = path.join(__dirname, 'data', 'picturePhotoAlbum.json');
const newDataPath = path.join(__dirname, 'data', 'picturePhotoAlbum_new.json');

console.log('🔄 Migration vers la nouvelle structure avec tags...');

try {
  // Lire les données actuelles
  const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf8'));
  console.log(`📖 Lecture de ${currentData.length} images`);

  // Migrer vers la nouvelle structure
  const newData = currentData.map(item => {
    return {
      imageId: item.imageId,
      imageName: item.imageName,
      imageDescription: item.imageDescription,
      imagePath: item.imagePath,
      tags: {
        "En Mer": [],           // À remplir manuellement
        "Evénements": [],       // À remplir manuellement
        "Escales": [],          // À remplir manuellement
        "Equipage": []          // À remplir manuellement
      }
    };
  });

  // Sauvegarder la nouvelle structure
  fs.writeFileSync(newDataPath, JSON.stringify(newData, null, 2), 'utf8');
  console.log(`💾 Nouvelle structure sauvegardée dans picturePhotoAlbum_new.json`);

  console.log('\n📝 Instructions pour compléter les tags:');
  console.log('1. Ouvrez picturePhotoAlbum_new.json');
  console.log('2. Pour chaque image, remplissez les arrays de tags appropriés:');
  console.log('   - "En Mer": ["Atlantique"], ["Pacifique"], ["Indien"]');
  console.log('   - "Evénements": ["Chantier"], ["Fêtes"], ["Divers"]');
  console.log('   - "Escales": ["Europe"], ["Amérique"], ["Océanie"], ["Asie"], ["Afrique"]');
  console.log('   - "Equipage": ["Martin"], ["Julien"], ["Mathias"], ["Neijma"]');
  console.log('3. Une image peut avoir plusieurs tags dans la même catégorie');
  console.log('4. Exemple: "Equipage": ["Julien", "Mathias"] pour une photo avec les deux');
  console.log('5. Renommez le fichier en picturePhotoAlbum.json quand terminé');

} catch (error) {
  console.error('❌ Erreur lors de la migration:', error.message);
  process.exit(1);
}
