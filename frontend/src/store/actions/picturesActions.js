import {
  FETCH_PICTURES_REQUEST,
  FETCH_PICTURES_SUCCESS,
  FETCH_PICTURES_FAILURE,
  UPLOAD_PICTURE_REQUEST,
  UPLOAD_PICTURE_SUCCESS,
  UPLOAD_PICTURE_FAILURE,
  DELETE_PICTURE_REQUEST,
  DELETE_PICTURE_SUCCESS,
  DELETE_PICTURE_FAILURE,
  FETCH_HAS_PICTURES_REQUEST,
  FETCH_HAS_PICTURES_SUCCESS,
  FETCH_HAS_PICTURES_FAILURE,
  BULK_FETCH_HAS_PICTURES_REQUEST,
  BULK_FETCH_HAS_PICTURES_SUCCESS,
  BULK_FETCH_HAS_PICTURES_FAILURE,
} from "./types";

// Nettoyage : API_URL inutilisé supprimé

// Action creators
export const fetchPicturesRequest = () => ({
  type: FETCH_PICTURES_REQUEST,
});

export const fetchPicturesSuccess = (pictures) => ({
  type: FETCH_PICTURES_SUCCESS,
  payload: pictures,
});

export const fetchPicturesFailure = (error) => ({
  type: FETCH_PICTURES_FAILURE,
  payload: error,
});

export const uploadPictureRequest = () => ({
  type: UPLOAD_PICTURE_REQUEST,
});

export const uploadPictureSuccess = (picture) => ({
  type: UPLOAD_PICTURE_SUCCESS,
  payload: picture,
});

export const uploadPictureFailure = (error) => ({
  type: UPLOAD_PICTURE_FAILURE,
  payload: error,
});

export const deletePictureRequest = () => ({
  type: DELETE_PICTURE_REQUEST,
});

export const deletePictureSuccess = (id) => ({
  type: DELETE_PICTURE_SUCCESS,
  payload: id,
});

export const deletePictureFailure = (error) => ({
  type: DELETE_PICTURE_FAILURE,
  payload: error,
});

// Thunk action creators
export const fetchPictures = () => {
  return async (dispatch) => {
    // request dans 
    dispatch(fetchPicturesRequest());
    try {
      const response = await fetch(`http://localhost:5000/api/v1/pictures`);
      if (!response.ok) {
        throw new Error("Failed to fetch pictures");
      }
      const data = await response.json();
      dispatch(fetchPicturesSuccess(data));
    } catch (error) {
      dispatch(fetchPicturesFailure(error.message));
    }
  };
};

export const fetchPictureById = (pictureId) => {
  return async (dispatch) => {
    dispatch(fetchPicturesRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/pictures/${pictureId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch picture with ID: ${pictureId}`);
      }
      const data = await response.json();

      // Check if we need to wrap the data in an array
      const payload = Array.isArray(data) ? data : [data];

      dispatch(fetchPicturesSuccess(payload));
      return data;
    } catch (error) {
  //
      dispatch(fetchPicturesFailure(error.message));
      throw error;
    }
  };
};

export const fetchPictureByPointId = (pointId) => {
  return async (dispatch) => {
    dispatch(fetchPicturesRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/points/${pointId}/pictures`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pictures for point");
      }
      const data = await response.json();
      dispatch(fetchPicturesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchPicturesFailure(error.message));
      throw error;
    }
  };
};

export const fetchHasPicturesRequest = () => ({
  type: FETCH_HAS_PICTURES_REQUEST,
});

export const fetchHasPicturesSuccess = (data) => ({
  type: FETCH_HAS_PICTURES_SUCCESS,
  payload: data,
});

export const fetchHasPicturesFailure = (error) => ({
  type: FETCH_HAS_PICTURES_FAILURE,
  payload: error,
});

export const fetchHasPicture = (pointId) => {
  return async (dispatch) => {
    dispatch(fetchHasPicturesRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/points/${pointId}/has-pictures`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to check if point has pictures");
      }
      const data = await response.json();
      dispatch(fetchHasPicturesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchHasPicturesFailure(error.message));
      throw error;
    }
  };
};

export const bulkFetchHasPicturesRequest = () => ({
  type: BULK_FETCH_HAS_PICTURES_REQUEST,
});

export const bulkFetchHasPicturesSuccess = (data) => ({
  type: BULK_FETCH_HAS_PICTURES_SUCCESS,
  payload: data,
});

export const bulkFetchHasPicturesFailure = (error) => ({
  type: BULK_FETCH_HAS_PICTURES_FAILURE,
  payload: error,
});

export const bulkFetchHasPictures = (pointIds) => {
  return async (dispatch) => {
    dispatch(bulkFetchHasPicturesRequest());
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/points/bulk-has-pictures",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointIds }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to bulk check points for pictures");
      }
      const data = await response.json();

      dispatch(bulkFetchHasPicturesSuccess(data));
      return data;
    } catch (error) {
      dispatch(bulkFetchHasPicturesFailure(error.message));
      throw error;
    }
  };
};
