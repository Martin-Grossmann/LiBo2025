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
} from "./types";

const API_URL = "/api/v1/picture-photo-album";

// Action creators pour les requêtes API
export const fetchPictureAlbumRequest = () => ({
  type: FETCH_PICTURE_ALBUM_REQUEST,
});

export const fetchPictureAlbumSuccess = (images) => ({
  type: FETCH_PICTURE_ALBUM_SUCCESS,
  payload: images,
});

export const fetchPictureAlbumFailure = (error) => ({
  type: FETCH_PICTURE_ALBUM_FAILURE,
  payload: error,
});

// Action creators pour les filtres
export const filterPictureAlbumByTags = (category, subCategory) => ({
  type: FILTER_PICTURE_ALBUM_BY_TAGS,
  payload: { category, subCategory },
});

export const resetPictureAlbumFilters = () => ({
  type: RESET_PICTURE_ALBUM_FILTERS,
});

// Action creators pour l'interface utilisateur
export const setCurrentAlbumImage = (index) => ({
  type: SET_CURRENT_ALBUM_IMAGE,
  payload: index,
});

export const setAlbumZoomLevel = (zoomLevel) => ({
  type: SET_ALBUM_ZOOM_LEVEL,
  payload: zoomLevel,
});

export const setImageIndividualZoom = (imageId, zoomLevel) => ({
  type: SET_IMAGE_INDIVIDUAL_ZOOM,
  payload: { imageId, zoomLevel },
});

export const toggleAlbumPhotoViewer = (isVisible) => ({
  type: TOGGLE_ALBUM_PHOTO_VIEWER,
  payload: isVisible,
});

// Thunk action creators pour les requêtes asynchrones
export const fetchPictureAlbum = () => {
  return async (dispatch) => {
    dispatch(fetchPictureAlbumRequest());
    try {
      const response = await fetch(`http://localhost:5000${API_URL}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch picture album: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Transformer les données pour correspondre au format attendu par le frontend
      const transformedImages = data.map(image => ({
        id: image.imageId,
        src: `http://localhost:5000/${image.imagePath}`,
        title: image.imageName,
        description: image.imageDescription,
        tags: image.tags,
        imagePath: image.imagePath,
        imageExists: image.imageExists || true,
        zoom: image.zoom || 1.0, // Inclure le zoom de l'image
      }));
      
      dispatch(fetchPictureAlbumSuccess(transformedImages));
      return transformedImages;
    } catch (error) {
      console.error("ERROR FETCHING PICTURE ALBUM:", error);
      dispatch(fetchPictureAlbumFailure(error.message));
      throw error;
    }
  };
};

// Thunk pour récupérer une image spécifique du photo album
export const fetchPictureAlbumById = (imageId) => {
  return async (dispatch) => {
    dispatch(fetchPictureAlbumRequest());
    try {
      const response = await fetch(`http://localhost:5000${API_URL}/${imageId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch album image with ID: ${imageId}`);
      }
      const data = await response.json();
      
      // Transformer l'image pour correspondre au format attendu
      const transformedImage = {
        id: data.imageId,
        src: `http://localhost:5000/${data.imagePath}`,
        title: data.imageName,
        description: data.imageDescription,
        tags: data.tags,
        imagePath: data.imagePath,
        imageExists: data.imageExists || true,
      };
      
      dispatch(fetchPictureAlbumSuccess([transformedImage]));
      return transformedImage;
    } catch (error) {
      console.error("ERROR FETCHING ALBUM IMAGE:", error);
      dispatch(fetchPictureAlbumFailure(error.message));
      throw error;
    }
  };
};

// Thunk pour filtrer les images avec des requêtes API
export const fetchFilteredPictureAlbum = (category, subCategory) => {
  return async (dispatch) => {
    dispatch(fetchPictureAlbumRequest());
    try {
      let url = `http://localhost:5000${API_URL}`;
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (subCategory) params.append('subCategory', subCategory);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch filtered images: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Transformer les données
      const transformedImages = data.map(image => ({
        id: image.imageId,
        src: `http://localhost:5000/${image.imagePath}`,
        title: image.imageName,
        description: image.imageDescription,
        tags: image.tags,
        imagePath: image.imagePath,
        imageExists: image.imageExists || true,
      }));
      
      dispatch(fetchPictureAlbumSuccess(transformedImages));
      dispatch(filterPictureAlbumByTags(category, subCategory));
      return transformedImages;
    } catch (error) {
      console.error("ERROR FETCHING FILTERED ALBUM:", error);
      dispatch(fetchPictureAlbumFailure(error.message));
      throw error;
    }
  };
};

// Action combinée pour gérer la navigation d'images
export const navigateToImage = (direction, currentIndex, totalImages) => {
  return (dispatch) => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % totalImages;
    } else if (direction === 'previous') {
      newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex;
    }
    
    dispatch(setCurrentAlbumImage(newIndex));
    dispatch(setAlbumZoomLevel(1)); // Reset zoom when changing image
    return newIndex;
  };
};

// Action pour gérer le zoom avec limites (global)
export const adjustZoom = (direction, currentZoom) => {
  return (dispatch) => {
    let newZoom = currentZoom;
    const zoomStep = 0.25;
    const minZoom = 0.5;
    const maxZoom = 3.0;
    
    if (direction === 'in') {
      newZoom = Math.min(currentZoom + zoomStep, maxZoom);
    } else if (direction === 'out') {
      newZoom = Math.max(currentZoom - zoomStep, minZoom);
    }
    
    dispatch(setAlbumZoomLevel(newZoom));
    return newZoom;
  };
};

// Action pour gérer le zoom individuel par image
export const adjustImageZoom = (direction, imageId, currentZoom) => {
  return (dispatch) => {
    console.log('🔧 adjustImageZoom called:', { direction, imageId, currentZoom });
    let newZoom = currentZoom;
    const zoomStep = 0.25;
    const minZoom = 0.5;
    const maxZoom = 3.0;
    if (direction === 'in') {
      newZoom = Math.min(currentZoom + zoomStep, maxZoom);
    } else if (direction === 'out') {
      newZoom = Math.max(currentZoom - zoomStep, minZoom);
    } else if (direction === 'set') {
      newZoom = Math.max(minZoom, Math.min(currentZoom, maxZoom));
    }
    console.log('🔧 New zoom calculated:', newZoom);
    dispatch(setImageIndividualZoom(imageId, newZoom));
    return newZoom;
  };
};
