import {
  FETCH_VIDEOS_REQUEST,
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_FAILURE,
  UPLOAD_VIDEO_REQUEST,
  UPLOAD_VIDEO_SUCCESS,
  UPLOAD_VIDEO_FAILURE,
  DELETE_VIDEO_REQUEST,
  DELETE_VIDEO_SUCCESS,
  DELETE_VIDEO_FAILURE,
  FETCH_HAS_VIDEOS_REQUEST,
  FETCH_HAS_VIDEOS_SUCCESS,
  FETCH_HAS_VIDEOS_FAILURE,
  BULK_FETCH_HAS_VIDEOS_REQUEST,
  BULK_FETCH_HAS_VIDEOS_SUCCESS,
  BULK_FETCH_HAS_VIDEOS_FAILURE,
} from "./types";

const API_URL = "/api/v1/videos"; // Adjust this to your actual API endpoint

// Action creators
export const fetchVideosRequest = () => ({
  type: FETCH_VIDEOS_REQUEST,
});

export const fetchVideosSuccess = (videos) => ({
  type: FETCH_VIDEOS_SUCCESS,
  payload: videos,
});

export const fetchVideosFailure = (error) => ({
  type: FETCH_VIDEOS_FAILURE,
  payload: error,
});

export const uploadVideoRequest = () => ({
  type: UPLOAD_VIDEO_REQUEST,
});

export const uploadVideoSuccess = (video) => ({
  type: UPLOAD_VIDEO_SUCCESS,
  payload: video,
});

export const uploadVideoFailure = (error) => ({
  type: UPLOAD_VIDEO_FAILURE,
  payload: error,
});

export const deleteVideoRequest = () => ({
  type: DELETE_VIDEO_REQUEST,
});

export const deleteVideoSuccess = (id) => ({
  type: DELETE_VIDEO_SUCCESS,
  payload: id,
});

export const deleteVideoFailure = (error) => ({
  type: DELETE_VIDEO_FAILURE,
  payload: error,
});

// Fetch has videos actionsAdd commentMore actions
export const fetchHasVideosRequest = () => ({
  type: FETCH_HAS_VIDEOS_REQUEST,
});

export const fetchHasVideosSuccess = (data) => ({
  type: FETCH_HAS_VIDEOS_SUCCESS,
  payload: data,
});

export const fetchHasVideosFailure = (error) => ({
  type: FETCH_HAS_VIDEOS_FAILURE,
  payload: error,
});

// Bulk fetch has videos actions
export const bulkFetchHasVideosRequest = () => ({
  type: BULK_FETCH_HAS_VIDEOS_REQUEST,
});

export const bulkFetchHasVideosSuccess = (data) => ({
  type: BULK_FETCH_HAS_VIDEOS_SUCCESS,
  payload: data,
});

export const bulkFetchHasVideosFailure = (error) => ({
  type: BULK_FETCH_HAS_VIDEOS_FAILURE,
  payload: error,
});

// Thunk action creators
export const fetchVideos = () => {
  return async (dispatch) => {
    dispatch(fetchVideosRequest());
    try {
      const response = await fetch(`http://localhost:5000/api/v1/videos`);
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      dispatch(fetchVideosSuccess(data));
    } catch (error) {
      dispatch(fetchVideosFailure(error.message));
    }
  };
};

export const uploadVideo = (formData) => {
  return async (dispatch) => {
    dispatch(uploadVideoRequest());
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        // No need to set Content-Type header when using FormData
      });
      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
      const data = await response.json();
      dispatch(uploadVideoSuccess(data));
    } catch (error) {
      dispatch(uploadVideoFailure(error.message));
    }
  };
};

export const deleteVideo = (id) => {
  return async (dispatch) => {
    dispatch(deleteVideoRequest());
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete video");
      }
      dispatch(deleteVideoSuccess(id));
    } catch (error) {
      dispatch(deleteVideoFailure(error.message));
    }
  };
};

export const fetchVideoById = (videoId) => {
  return async (dispatch) => {
    dispatch(fetchVideosRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/videos/${videoId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch video with ID: ${videoId}`);
      }
      const data = await response.json();

      // Check if we need to wrap the data in an array
      const payload = Array.isArray(data) ? data : [data];

      dispatch(fetchVideosSuccess(payload));
      return data;
    } catch (error) {
      console.error("ERROR FETCHING VIDEO:", error);
      dispatch(fetchVideosFailure(error.message));
      throw error;
    }
  };
};

export const fetchVideoByPointId = (pointId) => {
  return async (dispatch) => {
    dispatch(fetchVideosRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/points/${pointId}/videos`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch videos for point");
      }
      const data = await response.json();
      dispatch(fetchVideosSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchVideosFailure(error.message));
      throw error;
    }
  };
};

export const fetchHasVideo = (pointId) => {
  return async (dispatch) => {
    dispatch(fetchHasVideosRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/points/${pointId}/has-videos`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to check if point has videos");
      }
      const data = await response.json();
      dispatch(fetchHasVideosSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchHasVideosFailure(error.message));
      throw error;
    }
  };
};

export const bulkFetchHasVideos = (pointIds) => {
  return async (dispatch) => {
    dispatch(bulkFetchHasVideosRequest());
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/points/bulk-has-videos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointIds }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to bulk check points for videos");
      }
      const data = await response.json();

      dispatch(bulkFetchHasVideosSuccess(data));

      return data;
    } catch (error) {
      dispatch(bulkFetchHasVideosFailure(error.message));
      throw error;
    }
  };
};
