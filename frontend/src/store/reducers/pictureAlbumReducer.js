import {
  FETCH_PICTURE_ALBUM_REQUEST,
  FETCH_PICTURE_ALBUM_SUCCESS,
  FETCH_PICTURE_ALBUM_FAILURE,
  FILTER_PICTURE_ALBUM_BY_TAGS,
  RESET_PICTURE_ALBUM_FILTERS,
  SET_CURRENT_ALBUM_IMAGE,
  SET_ALBUM_ZOOM_LEVEL,
  SET_IMAGE_INDIVIDUAL_ZOOM,
  TOGGLE_ALBUM_PHOTO_VIEWER,
} from "../actions/types";

const initialState = {
  // Données des images
  allImages: [],
  filteredImages: [],
  currentImageIndex: 0,
  
  // États de l'interface
  showPhotoViewer: true,
  zoomLevel: 1, // Zoom global (pour compatibilité)
  imageZooms: {}, // Zoom individuel par imageId
  
  // Filtres
  selectedCategory: '',
  selectedSubCategory: '',
  
  // États de chargement
  loading: false,
  error: null,
  
  // Métadonnées
  totalImages: 0,
  hasImages: false,
};

const pictureAlbumReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PICTURE_ALBUM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PICTURE_ALBUM_SUCCESS:
      const images = action.payload || [];
      
      // Initialiser les zooms individuels depuis les données JSON
      const imageZooms = {};
      images.forEach(image => {
        imageZooms[image.id] = image.zoom || 1.0;
      });
      
      return {
        ...state,
        loading: false,
        error: null,
        allImages: images,
        filteredImages: images, // Au début, les images filtrées = toutes les images
        totalImages: images.length,
        hasImages: images.length > 0,
        currentImageIndex: 0, // Reset à la première image
        imageZooms: imageZooms, // Initialiser les zooms individuels
      };

    case FETCH_PICTURE_ALBUM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        allImages: [],
        filteredImages: [],
        totalImages: 0,
        hasImages: false,
      };

    case FILTER_PICTURE_ALBUM_BY_TAGS:
      const { category, subCategory } = action.payload;
      
      // Filtrer les images selon les critères
      let filtered = state.allImages;
      
      if (category || subCategory) {
        filtered = state.allImages.filter(image => {
          if (!image.tags) return false;
          
          // Si seulement la catégorie est sélectionnée
          if (category && !subCategory) {
            return image.tags[category] && image.tags[category].length > 0;
          }
          
          // Si catégorie ET sous-catégorie sont sélectionnées
          if (category && subCategory) {
            return image.tags[category] && image.tags[category].includes(subCategory);
          }
          
          return true;
        });
      }
      
      return {
        ...state,
        filteredImages: filtered,
        selectedCategory: category,
        selectedSubCategory: subCategory,
        currentImageIndex: 0, // Reset à la première image filtrée
        totalImages: filtered.length,
        hasImages: filtered.length > 0,
      };

    case RESET_PICTURE_ALBUM_FILTERS:
      return {
        ...state,
        filteredImages: state.allImages,
        selectedCategory: '',
        selectedSubCategory: '',
        currentImageIndex: 0,
        totalImages: state.allImages.length,
        hasImages: state.allImages.length > 0,
      };

    case SET_CURRENT_ALBUM_IMAGE:
      const newIndex = action.payload;
      const maxIndex = state.filteredImages.length - 1;
      
      // S'assurer que l'index est dans les limites valides
      const validIndex = Math.max(0, Math.min(newIndex, maxIndex));
      
      return {
        ...state,
        currentImageIndex: validIndex,
      };

    case SET_ALBUM_ZOOM_LEVEL:
      const newZoom = action.payload;
      // Limiter le zoom entre 0.5 et 3.0
      const validZoom = Math.max(0.5, Math.min(newZoom, 3.0));
      
      return {
        ...state,
        zoomLevel: validZoom,
      };

    case SET_IMAGE_INDIVIDUAL_ZOOM:
      const { imageId, zoomLevel } = action.payload;
      console.log('🔧 Reducer SET_IMAGE_INDIVIDUAL_ZOOM:', { imageId, zoomLevel });
      
      // Limiter le zoom entre 0.5 et 3.0
      const validImageZoom = Math.max(0.5, Math.min(zoomLevel, 3.0));
      
      console.log('🔧 Valid zoom for image', imageId, ':', validImageZoom);
      
      return {
        ...state,
        imageZooms: {
          ...state.imageZooms,
          [imageId]: validImageZoom,
        },
      };

    case TOGGLE_ALBUM_PHOTO_VIEWER:
      return {
        ...state,
        showPhotoViewer: action.payload,
        // Reset du zoom, de l'index et des filtres quand on ferme le viewer
        ...(action.payload === false && {
          currentImageIndex: 0,
          zoomLevel: 1,
          filteredImages: state.allImages,
          selectedCategory: '',
          selectedSubCategory: '',
        }),
      };

    default:
      return state;
  }
};

// Selectors pour faciliter l'accès aux données
export const selectPictureAlbum = (state) => state.pictureAlbum || {};
export const selectCurrentImage = (state) => {
  const album = state.pictureAlbum;
  if (!album || !album.filteredImages || album.filteredImages.length === 0) {
    return null;
  }
  return album.filteredImages[album.currentImageIndex] || null;
};
export const selectFilteredImages = (state) => state.pictureAlbum?.filteredImages || [];
export const selectAlbumLoading = (state) => state.pictureAlbum?.loading || false;
export const selectAlbumError = (state) => state.pictureAlbum?.error || null;
export const selectAlbumFilters = (state) => ({
  category: state.pictureAlbum?.selectedCategory || '',
  subCategory: state.pictureAlbum?.selectedSubCategory || '',
});

// Sélecteur pour obtenir le zoom d'une image spécifique
export const selectImageZoom = (state, imageId) => {
  const imageZooms = state.pictureAlbum?.imageZooms || {};
  // Retourne le zoom individuel ou le zoom depuis le JSON ou 1.0 par défaut
  return imageZooms[imageId] || 1.0;
};

export default pictureAlbumReducer;
