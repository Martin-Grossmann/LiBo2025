import {
  FETCH_TAGS_REQUEST,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
  FETCH_TAG_REQUEST,
  FETCH_TAG_SUCCESS,
  FETCH_TAG_FAILURE,
  CREATE_TAG_REQUEST,
  CREATE_TAG_SUCCESS,
  CREATE_TAG_FAILURE,
  UPDATE_TAG_REQUEST,
  UPDATE_TAG_SUCCESS,
  UPDATE_TAG_FAILURE,
  DELETE_TAG_REQUEST,
  DELETE_TAG_SUCCESS,
  DELETE_TAG_FAILURE,
  FETCH_TAGS_BY_CATEGORY_REQUEST,
  FETCH_TAGS_BY_CATEGORY_SUCCESS,
  FETCH_TAGS_BY_CATEGORY_FAILURE
} from "./types";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Fetch all tags
export const fetchTagsRequest = () => ({
  type: FETCH_TAGS_REQUEST
});

export const fetchTagsSuccess = (tags) => ({
  type: FETCH_TAGS_SUCCESS,
  payload: tags
});

export const fetchTagsFailure = (error) => ({
  type: FETCH_TAGS_FAILURE,
  payload: error
});

export const fetchTags = () => {
  return async (dispatch) => {
    dispatch(fetchTagsRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("ALL TAGS FETCHED");
      console.log(data);
      
      // The issue is here - data.data is undefined
      // Let's check the structure of the response
      console.log("Response structure:", Object.keys(data));
      
      // If data is directly an array, use it directly
      // Otherwise, try to extract data.data if it exists
      const tagsData = Array.isArray(data) ? data : (data.data || []);
      
      console.log("Dispatching to reducer:", tagsData);
      dispatch(fetchTagsSuccess(tagsData));
      return tagsData;
    } catch (error) {
      console.error("Error fetching tags:", error);
      dispatch(fetchTagsFailure(error.message));
      throw error;
    }
  };
};

// Fetch a single tag by ID
export const fetchTagRequest = () => ({
  type: FETCH_TAG_REQUEST
});

export const fetchTagSuccess = (tag) => ({
  type: FETCH_TAG_SUCCESS,
  payload: tag
});

export const fetchTagFailure = (error) => ({
  type: FETCH_TAG_FAILURE,
  payload: error
});

export const fetchTag = (id) => {
  return async (dispatch) => {
    dispatch(fetchTagRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/tags/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(fetchTagSuccess(data.data));
      return data.data;
    } catch (error) {
      dispatch(fetchTagFailure(error.message));
      throw error;
    }
  };
};

// Create a new tag
export const createTagRequest = () => ({
  type: CREATE_TAG_REQUEST
});

export const createTagSuccess = (tag) => ({
  type: CREATE_TAG_SUCCESS,
  payload: tag
});

export const createTagFailure = (error) => ({
  type: CREATE_TAG_FAILURE,
  payload: error
});

export const createTag = (tagData) => {
  return async (dispatch) => {
    dispatch(createTagRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tagData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(createTagSuccess(data.data));
      return data.data;
    } catch (error) {
      dispatch(createTagFailure(error.message));
      throw error;
    }
  };
};

// Update a tag
export const updateTagRequest = () => ({
  type: UPDATE_TAG_REQUEST
});

export const updateTagSuccess = (tag) => ({
  type: UPDATE_TAG_SUCCESS,
  payload: tag
});

export const updateTagFailure = (error) => ({
  type: UPDATE_TAG_FAILURE,
  payload: error
});

export const updateTag = (id, tagData) => {
  return async (dispatch) => {
    dispatch(updateTagRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tagData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(updateTagSuccess(data.data));
      return data.data;
    } catch (error) {
      dispatch(updateTagFailure(error.message));
      throw error;
    }
  };
};

// Delete a tag
export const deleteTagRequest = () => ({
  type: DELETE_TAG_REQUEST
});

export const deleteTagSuccess = (id) => ({
  type: DELETE_TAG_SUCCESS,
  payload: id
});

export const deleteTagFailure = (error) => ({
  type: DELETE_TAG_FAILURE,
  payload: error
});

export const deleteTag = (id) => {
  return async (dispatch) => {
    dispatch(deleteTagRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(deleteTagSuccess(id));
      return data;
    } catch (error) {
      dispatch(deleteTagFailure(error.message));
      throw error;
    }
  };
};

// Fetch tags by category
export const fetchTagsByCategoryRequest = () => ({
  type: FETCH_TAGS_BY_CATEGORY_REQUEST
});

export const fetchTagsByCategorySuccess = (tags) => ({
  type: FETCH_TAGS_BY_CATEGORY_SUCCESS,
  payload: tags
});

export const fetchTagsByCategoryFailure = (error) => ({
  type: FETCH_TAGS_BY_CATEGORY_FAILURE,
  payload: error
});

export const fetchTagsByCategory = (category) => {
  return async (dispatch) => {
    dispatch(fetchTagsByCategoryRequest());
    try {
      const response = await fetch(`${API_BASE_URL}/tags/category/${category}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(fetchTagsByCategorySuccess(data.data));
      return data.data;
    } catch (error) {
      dispatch(fetchTagsByCategoryFailure(error.message));
      throw error;
    }
  };
};