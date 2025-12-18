import {
  FETCH_PICTURE_TAGS_REQUEST,
  FETCH_PICTURE_TAGS_SUCCESS,
  FETCH_PICTURE_TAGS_FAILURE,
  FETCH_TAGS_FOR_PICTURE_REQUEST,
  FETCH_TAGS_FOR_PICTURE_SUCCESS,
  FETCH_TAGS_FOR_PICTURE_FAILURE,
  FETCH_PICTURES_FOR_TAG_REQUEST,
  FETCH_PICTURES_FOR_TAG_SUCCESS,
  FETCH_PICTURES_FOR_TAG_FAILURE,
  ADD_TAG_TO_PICTURE_REQUEST,
  ADD_TAG_TO_PICTURE_SUCCESS,
  ADD_TAG_TO_PICTURE_FAILURE,
  REMOVE_TAG_FROM_PICTURE_REQUEST,
  REMOVE_TAG_FROM_PICTURE_SUCCESS,
  REMOVE_TAG_FROM_PICTURE_FAILURE,
  SEARCH_PICTURES_BY_TAGS_REQUEST,
  SEARCH_PICTURES_BY_TAGS_SUCCESS,
  SEARCH_PICTURES_BY_TAGS_FAILURE,
} from "./types";

const API_URL = "http://localhost:5000/api/v1/picture-tags";

// Fetch all picture-tag relationships
export const fetchPictureTagsRequest = () => ({
  type: FETCH_PICTURE_TAGS_REQUEST,
});

export const fetchPictureTagsSuccess = (data) => ({
  type: FETCH_PICTURE_TAGS_SUCCESS,
  payload: data,
});

export const fetchPictureTagsFailure = (error) => ({
  type: FETCH_PICTURE_TAGS_FAILURE,
  payload: error,
});

export const fetchPictureTags = () => {
  return async (dispatch) => {
    dispatch(fetchPictureTagsRequest());
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch picture-tag relationships");
      }
      const data = await response.json();
      dispatch(fetchPictureTagsSuccess(data.data));
      return data.data;
    } catch (error) {
      dispatch(fetchPictureTagsFailure(error.message));
      throw error;
    }
  };
};

// Fetch tags for a specific picture
export const fetchTagsForPictureRequest = () => ({
  type: FETCH_TAGS_FOR_PICTURE_REQUEST,
});

export const fetchTagsForPictureSuccess = (data) => ({
  type: FETCH_TAGS_FOR_PICTURE_SUCCESS,
  payload: data,
});

export const fetchTagsForPictureFailure = (error) => ({
  type: FETCH_TAGS_FOR_PICTURE_FAILURE,
  payload: error,
});

export const fetchTagsForPicture = (pictureId) => {
  return async (dispatch) => {
    dispatch(fetchTagsForPictureRequest());
    try {
      const response = await fetch(`${API_URL}/picture/${pictureId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tags for picture ID: ${pictureId}`);
      }
      const data = await response.json();
      dispatch(fetchTagsForPictureSuccess({
        pictureId: parseInt(pictureId),
        tags: data.data
      }));
      return data.data;
    } catch (error) {
      dispatch(fetchTagsForPictureFailure(error.message));
      throw error;
    }
  };
};

// Fetch pictures for a specific tag
export const fetchPicturesForTagRequest = () => ({
  type: FETCH_PICTURES_FOR_TAG_REQUEST,
});

export const fetchPicturesForTagSuccess = (data) => ({
  type: FETCH_PICTURES_FOR_TAG_SUCCESS,
  payload: data,
});

export const fetchPicturesForTagFailure = (error) => ({
  type: FETCH_PICTURES_FOR_TAG_FAILURE,
  payload: error,
});

export const fetchPicturesForTag = (tagId) => {
  return async (dispatch) => {
    dispatch(fetchPicturesForTagRequest());
    try {
      const response = await fetch(`${API_URL}/tag/${tagId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pictures for tag ID: ${tagId}`);
      }
      const data = await response.json();
      dispatch(fetchPicturesForTagSuccess({
        tagId: parseInt(tagId),
        pictures: data.data
      }));
      return data.data;
    } catch (error) {
      dispatch(fetchPicturesForTagFailure(error.message));
      throw error;
    }
  };
};

// Add a tag to a picture
export const addTagToPictureRequest = () => ({
  type: ADD_TAG_TO_PICTURE_REQUEST,
});

export const addTagToPictureSuccess = (data) => ({
  type: ADD_TAG_TO_PICTURE_SUCCESS,
  payload: data,
});

export const addTagToPictureFailure = (error) => ({
  type: ADD_TAG_TO_PICTURE_FAILURE,
  payload: error,
});

export const addTagToPicture = (pictureId, tagId) => {
  return async (dispatch) => {
    dispatch(addTagToPictureRequest());
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pictureId, tagId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add tag to picture");
      }
      const data = await response.json();
      dispatch(addTagToPictureSuccess(data.data));
      return data.data;
    } catch (error) {
      dispatch(addTagToPictureFailure(error.message));
      throw error;
    }
  };
};

// Remove a tag from a picture
export const removeTagFromPictureRequest = () => ({
  type: REMOVE_TAG_FROM_PICTURE_REQUEST,
});

export const removeTagFromPictureSuccess = (data) => ({
  type: REMOVE_TAG_FROM_PICTURE_SUCCESS,
  payload: data,
});

export const removeTagFromPictureFailure = (error) => ({
  type: REMOVE_TAG_FROM_PICTURE_FAILURE,
  payload: error,
});

export const removeTagFromPicture = (pictureId, tagId) => {
  return async (dispatch) => {
    dispatch(removeTagFromPictureRequest());
    try {
      const response = await fetch(`${API_URL}/${pictureId}/${tagId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove tag from picture");
      }
      const data = await response.json();
      dispatch(removeTagFromPictureSuccess({
        pictureId: parseInt(pictureId),
        tagId: parseInt(tagId),
        relationship: data.data
      }));
      return data.data;
    } catch (error) {
      dispatch(removeTagFromPictureFailure(error.message));
      throw error;
    }
  };
};

// Search pictures by tags
export const searchPicturesByTagsRequest = () => ({
  type: SEARCH_PICTURES_BY_TAGS_REQUEST,
});

export const searchPicturesByTagsSuccess = (data) => ({
  type: SEARCH_PICTURES_BY_TAGS_SUCCESS,
  payload: data,
});

export const searchPicturesByTagsFailure = (error) => ({
  type: SEARCH_PICTURES_BY_TAGS_FAILURE,
  payload: error,
});

export const searchPicturesByTags = (tagIds) => {
  return async (dispatch) => {
    dispatch(searchPicturesByTagsRequest());
    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagIds }),
      });
      if (!response.ok) {
        throw new Error("Failed to search pictures by tags");
      }
      const data = await response.json();
      dispatch(searchPicturesByTagsSuccess({
        tagIds,
        pictures: data.data,
        count: data.count
      }));
      return data.data;
    } catch (error) {
      dispatch(searchPicturesByTagsFailure(error.message));
      throw error;
    }
  };
};