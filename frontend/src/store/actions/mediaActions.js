import {
  FETCH_MEDIA_REQUEST,
  FETCH_MEDIA_SUCCESS,
  FETCH_MEDIA_FAILURE,
  FETCH_MEDIA_BY_POINT_REQUEST,
  FETCH_MEDIA_BY_POINT_SUCCESS,
  FETCH_MEDIA_BY_POINT_FAILURE,
  FETCH_MEDIA_BY_ID_REQUEST,
  FETCH_MEDIA_BY_ID_SUCCESS,
  FETCH_MEDIA_BY_ID_FAILURE,
  FETCH_HAS_MEDIA_REQUEST,
  FETCH_HAS_MEDIA_SUCCESS,
  FETCH_HAS_MEDIA_FAILURE,
  BULK_FETCH_HAS_MEDIA_REQUEST,
  BULK_FETCH_HAS_MEDIA_SUCCESS,
  BULK_FETCH_HAS_MEDIA_FAILURE,
  ADD_TAG_TO_MEDIA_REQUEST,
  ADD_TAG_TO_MEDIA_SUCCESS,
  ADD_TAG_TO_MEDIA_FAILURE,
  REMOVE_TAG_FROM_MEDIA_REQUEST,
  REMOVE_TAG_FROM_MEDIA_SUCCESS,
  REMOVE_TAG_FROM_MEDIA_FAILURE,
  FETCH_MEDIA_BY_TAG_REQUEST,
  FETCH_MEDIA_BY_TAG_SUCCESS,
  FETCH_MEDIA_BY_TAG_FAILURE,
  SEARCH_MEDIA_BY_TAGS_REQUEST,
  SEARCH_MEDIA_BY_TAGS_SUCCESS,
  SEARCH_MEDIA_BY_TAGS_FAILURE,
  ADD_MEDIA_REQUEST,
  ADD_MEDIA_SUCCESS,
  ADD_MEDIA_FAILURE,
  UPDATE_MEDIA_REQUEST,
  UPDATE_MEDIA_SUCCESS,
  UPDATE_MEDIA_FAILURE,
  DELETE_MEDIA_REQUEST,
  DELETE_MEDIA_SUCCESS,
  DELETE_MEDIA_FAILURE,
} from "../types/mediaTypes";
import { buildApiUrl, ENDPOINTS } from "../../config/api";

const MEDIA_API_URL = buildApiUrl(ENDPOINTS.MEDIA);

// Action creators
export const fetchMediaRequest = () => ({
  type: FETCH_MEDIA_REQUEST,
});

export const fetchMediaSuccess = (media) => ({
  type: FETCH_MEDIA_SUCCESS,
  payload: media,
});

export const fetchMediaFailure = (error) => ({
  type: FETCH_MEDIA_FAILURE,
  payload: error,
});

// Fetch all media (optionally filtered by type)
export const fetchAllMedia = (type = null) => {
  return async (dispatch) => {
    dispatch(fetchMediaRequest());

    try {
      const url = type ? `${MEDIA_API_URL}?type=${type}` : MEDIA_API_URL;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(fetchMediaSuccess(data.data.media || []));
    } catch (error) {
      dispatch(fetchMediaFailure(error.message));
    }
  };
};

// Fetch media by point ID (optionally filtered by type)
export const fetchMediaByPointId = (pointId, type = null) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MEDIA_BY_POINT_REQUEST, pointId });

    try {
      const typeParam = type ? `?type=${type}` : "";
      const response = await fetch(
        `${buildApiUrl(ENDPOINTS.POINTS)}/${pointId}/media${typeParam}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: FETCH_MEDIA_BY_POINT_SUCCESS,
        payload: data.data.media || [],
        pointId: pointId,
      });
    } catch (error) {
      dispatch({
        type: FETCH_MEDIA_BY_POINT_FAILURE,
        payload: error.message,
        pointId: pointId,
      });
    }
  };
};

// Fetch media by ID
export const fetchMediaById = (mediaId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MEDIA_BY_ID_REQUEST });

    try {
      const response = await fetch(`${MEDIA_API_URL}/${mediaId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: FETCH_MEDIA_BY_ID_SUCCESS,
        payload: data.data.media,
      });
    } catch (error) {
      dispatch({
        type: FETCH_MEDIA_BY_ID_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Check if point has media
export const fetchHasMedia = (pointId, type = null) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_HAS_MEDIA_REQUEST });

    try {
      const typeParam = type ? `?type=${type}` : "";
      const response = await fetch(
        `${buildApiUrl(ENDPOINTS.POINTS)}/${pointId}/has-media${typeParam}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: FETCH_HAS_MEDIA_SUCCESS,
        payload: { pointId, ...data.data },
      });
    } catch (error) {
      dispatch({
        type: FETCH_HAS_MEDIA_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Bulk check if points have media
export const bulkFetchHasMedia = (pointIds, type = null) => {
  return async (dispatch) => {
    dispatch({ type: BULK_FETCH_HAS_MEDIA_REQUEST });

    try {
      const typeParam = type ? `?type=${type}` : "";
      const response = await fetch(
        `${buildApiUrl(ENDPOINTS.POINTS)}/bulk-has-media${typeParam}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointIds }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: BULK_FETCH_HAS_MEDIA_SUCCESS,
        payload: data.data.results || [],
      });
    } catch (error) {
      dispatch({
        type: BULK_FETCH_HAS_MEDIA_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Add tag to media
export const addTagToMedia = (mediaId, tagId) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TAG_TO_MEDIA_REQUEST });

    try {
      const response = await fetch(`${MEDIA_API_URL}/${mediaId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: ADD_TAG_TO_MEDIA_SUCCESS,
        payload: data.data.media,
      });
    } catch (error) {
      dispatch({
        type: ADD_TAG_TO_MEDIA_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Remove tag from media
export const removeTagFromMedia = (mediaId, tagId) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_TAG_FROM_MEDIA_REQUEST });

    try {
      const response = await fetch(
        `${MEDIA_API_URL}/${mediaId}/tags/${tagId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: REMOVE_TAG_FROM_MEDIA_SUCCESS,
        payload: data.data.media,
      });
    } catch (error) {
      dispatch({
        type: REMOVE_TAG_FROM_MEDIA_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Fetch media by tag
export const fetchMediaByTag = (tagId, type = null) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MEDIA_BY_TAG_REQUEST });

    try {
      const typeParam = type ? `?type=${type}` : "";
      const response = await fetch(`${MEDIA_API_URL}/tag/${tagId}${typeParam}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: FETCH_MEDIA_BY_TAG_SUCCESS,
        payload: data.data.media || [],
      });
    } catch (error) {
      dispatch({
        type: FETCH_MEDIA_BY_TAG_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Search media by tags
export const searchMediaByTags = (tagIds, type = null) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MEDIA_BY_TAGS_REQUEST });

    try {
      const typeParam = type ? `?type=${type}` : "";
      const response = await fetch(`${MEDIA_API_URL}/search/tags${typeParam}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: SEARCH_MEDIA_BY_TAGS_SUCCESS,
        payload: data.data.media || [],
      });
    } catch (error) {
      console.error("API Error - searchMediaByTags:", error);
      dispatch({
        type: SEARCH_MEDIA_BY_TAGS_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Add new media to a point (with file upload)
export const addMediaToPoint = (pointId, formData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_MEDIA_REQUEST });

    try {
      const response = await fetch(
        `${buildApiUrl(ENDPOINTS.POINTS)}/${pointId}/media`,
        {
          method: "POST",
          body: formData, // FormData object with file and other fields
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: ADD_MEDIA_SUCCESS,
        payload: data.data.media,
      });

      return data.data.media; // Return the created media for further use
    } catch (error) {
      console.error("Add media error:", error);
      dispatch({
        type: ADD_MEDIA_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

// Update existing media (with optional file replacement)
export const updateMedia = (mediaId, formData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MEDIA_REQUEST });

    try {
      const response = await fetch(`${MEDIA_API_URL}/${mediaId}`, {
        method: "PUT",
        body: formData, // FormData object with file and other fields
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: UPDATE_MEDIA_SUCCESS,
        payload: data.data.media,
      });

      return data.data.media; // Return the updated media
    } catch (error) {
      console.error("Update media error:", error);
      dispatch({
        type: UPDATE_MEDIA_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

// Delete media (soft delete)
export const deleteMedia = (mediaId, options = {}) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_MEDIA_REQUEST });

    try {
      const response = await fetch(`${MEDIA_API_URL}/${mediaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options), // { deleteFromS3: true/false }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: DELETE_MEDIA_SUCCESS,
        payload: { mediaId, ...data.data },
      });

      return data; // Return the result
    } catch (error) {
      console.error("Delete media error:", error);
      dispatch({
        type: DELETE_MEDIA_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

// Permanently delete media (hard delete)
export const permanentlyDeleteMedia = (mediaId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_MEDIA_REQUEST });

    try {
      const response = await fetch(`${MEDIA_API_URL}/${mediaId}/permanent`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: DELETE_MEDIA_SUCCESS,
        payload: { mediaId, permanent: true, ...data.data },
      });

      return data; // Return the result
    } catch (error) {
      console.error("Permanent delete media error:", error);
      dispatch({
        type: DELETE_MEDIA_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

// Helper function to create FormData for media upload
export const createMediaFormData = (file, mediaData = {}) => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  // Add other fields
  Object.keys(mediaData).forEach((key) => {
    if (mediaData[key] !== undefined && mediaData[key] !== null) {
      if (Array.isArray(mediaData[key])) {
        // Handle arrays (like tags)
        mediaData[key].forEach((item) => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(key, mediaData[key]);
      }
    }
  });

  return formData;
};

// Legacy support functions - these wrap the new unified functions
export const fetchAllImages = () => fetchAllMedia("image");
export const fetchAllVideos = () => fetchAllMedia("video");
export const fetchImagesByPointId = (pointId) =>
  fetchMediaByPointId(pointId, "image");
export const fetchVideosByPointId = (pointId) =>
  fetchMediaByPointId(pointId, "video");
export const fetchHasImages = (pointId) => fetchHasMedia(pointId, "image");
export const fetchHasVideos = (pointId) => fetchHasMedia(pointId, "video");
export const bulkFetchHasImages = (pointIds) =>
  bulkFetchHasMedia(pointIds, "image");
export const bulkFetchHasVideos = (pointIds) =>
  bulkFetchHasMedia(pointIds, "video");

// For backward compatibility with existing code
export const fetchPictureByPointId = fetchImagesByPointId;
export const fetchVideoByPointId = fetchVideosByPointId;

// Legacy picture management functions
export const addPictureToPoint = (pointId, file, pictureData = {}) => {
  const mediaData = {
    type: "image",
    ...pictureData,
    imageName: pictureData.imageName || pictureData.name,
    imageDescription: pictureData.imageDescription || pictureData.description,
  };
  const formData = createMediaFormData(file, mediaData);
  return addMediaToPoint(pointId, formData);
};

export const updatePicture = (mediaId, file, pictureData = {}) => {
  const mediaData = {
    ...pictureData,
    imageName: pictureData.imageName || pictureData.name,
    imageDescription: pictureData.imageDescription || pictureData.description,
    replaceFile: file ? true : false,
  };
  const formData = createMediaFormData(file, mediaData);
  return updateMedia(mediaId, formData);
};

export const deletePicture = (mediaId, options = {}) => {
  return deleteMedia(mediaId, options);
};

// Legacy video management functions
export const addVideoToPoint = (pointId, file, videoData = {}) => {
  const mediaData = {
    type: "video",
    ...videoData,
    videoName: videoData.videoName || videoData.name,
    videoDescription: videoData.videoDescription || videoData.description,
  };
  const formData = createMediaFormData(file, mediaData);
  return addMediaToPoint(pointId, formData);
};

export const updateVideo = (mediaId, file, videoData = {}) => {
  const mediaData = {
    ...videoData,
    videoName: videoData.videoName || videoData.name,
    videoDescription: videoData.videoDescription || videoData.description,
    replaceFile: file ? true : false,
  };
  const formData = createMediaFormData(file, mediaData);
  return updateMedia(mediaId, formData);
};

export const deleteVideo = (mediaId, options = {}) => {
  return deleteMedia(mediaId, options);
};
