// Utilitaire pour filtrer les images selon les critères sélectionnés
export const filterImagesByTags = (images, selectedCategory, selectedSubCategory) => {
  if (!selectedCategory && !selectedSubCategory) {
    return images; // Aucun filtre, retourner toutes les images
  }

  return images.filter(image => {
    // Vérifier si l'image a des tags pour la catégorie sélectionnée
    if (selectedCategory && !image.tags[selectedCategory]) {
      return false;
    }

    // Si seulement la catégorie est sélectionnée (pas de sous-catégorie)
    if (selectedCategory && !selectedSubCategory) {
      // Vérifier si l'image a au moins un tag dans cette catégorie
      return image.tags[selectedCategory].length > 0;
    }

    // Si la catégorie ET la sous-catégorie sont sélectionnées
    if (selectedCategory && selectedSubCategory) {
      // Vérifier si l'image contient le tag spécifique
      return image.tags[selectedCategory].includes(selectedSubCategory);
    }

    return false;
  });
};

// Fonction pour charger les images depuis l'API
export const loadImagesFromAPI = async () => {
  try {
    const response = await fetch('/api/picture-photo-album');
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const images = await response.json();
    
    // Transformer les données pour correspondre au format attendu par le composant
    return images.map(image => ({
      id: image.imageId,
      src: `/${image.imagePath}`, // Construire le chemin complet
      title: image.imageName,
      description: image.imageDescription,
      tags: image.tags
    }));
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
};
