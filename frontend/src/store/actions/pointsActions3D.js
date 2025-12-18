import {
  FETCH_POINTS_REQUEST,
  FETCH_POINTS_SUCCESS,
  FETCH_POINTS_FAILURE,
  ADD_POINT_REQUEST,
  ADD_POINT_SUCCESS,
  ADD_POINT_FAILURE,
  UPDATE_POINT_REQUEST,
  UPDATE_POINT_SUCCESS,
  UPDATE_POINT_FAILURE,
  DELETE_POINT_REQUEST,
  DELETE_POINT_SUCCESS,
  DELETE_POINT_FAILURE,
  SET_YEAR_FILTER, // Ajouter cette importation
} from "./types";

import { bulkFetchHasPictures } from "./picturesActions";
import { bulkFetchHasVideos } from "./videosActions";

const API_URL = "/api/points"; // Adjust this to your actual API endpoint

// Action creators
export const fetchPointsRequest = () => ({
  type: FETCH_POINTS_REQUEST,
});

export const fetchPointsSuccess = (points) => ({
  type: FETCH_POINTS_SUCCESS,
  payload: points,
});

export const fetchPointsFailure = (error) => ({
  type: FETCH_POINTS_FAILURE,
  payload: error,
});

// Action pour définir le filtre année
export const setYearFilter = (year) => ({
  type: SET_YEAR_FILTER,
  payload: year,
});

export const addPointRequest = () => ({
  type: ADD_POINT_REQUEST,
});

export const addPointSuccess = (point) => ({
  type: ADD_POINT_SUCCESS,
  payload: point,
});

export const addPointFailure = (error) => ({
  type: ADD_POINT_FAILURE,
  payload: error,
});

export const updatePointRequest = () => ({
  type: UPDATE_POINT_REQUEST,
});

export const updatePointSuccess = (point) => ({
  type: UPDATE_POINT_SUCCESS,
  payload: point,
});

export const updatePointFailure = (error) => ({
  type: UPDATE_POINT_FAILURE,
  payload: error,
});

export const deletePointRequest = () => ({
  type: DELETE_POINT_REQUEST,
});

export const deletePointSuccess = (id) => ({
  type: DELETE_POINT_SUCCESS,
  payload: id,
});

export const deletePointFailure = (error) => ({
  type: DELETE_POINT_FAILURE,
  payload: error,
});

// Thunk action creators
export const fetchPoints = () => {
  return async (dispatch) => {
    dispatch(fetchPointsRequest());
    try {
      const response = await fetch(`http://localhost:5000/api/v1/points`);
      if (!response.ok) {
        throw new Error("Failed to fetch points");
      }
      const data = await response.json();

      dispatch(fetchPointsSuccess(data));

      const pointIds = Array.isArray(data)
        ? data.map((point) => point.entry_id)
        : [];
      if (pointIds.length > 0) {
        dispatch(bulkFetchHasPictures(pointIds));
        dispatch(bulkFetchHasVideos(pointIds));
      }
    } catch (error) {
      dispatch(fetchPointsFailure(error.message));
    }
  };
};

export const fetchPointsByYear = (year) => {
  return async (dispatch) => {
    dispatch(fetchPointsRequest());
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/points/year/${year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch points");
      }
      const data = await response.json();

      dispatch(fetchPointsSuccess(data));

      // Extract point IDs and dispatch bulkFetchHasPictures
      const pointIds = Array.isArray(data)
        ? data.map((point) => point.entry_id)
        : [];
      if (pointIds.length > 0) {
        dispatch(bulkFetchHasPictures(pointIds));
        dispatch(bulkFetchHasVideos(pointIds));
      }
    } catch (error) {
      dispatch(fetchPointsFailure(error.message));
    }
  };
};

export const addPoint = (pointData) => {
  return async (dispatch) => {
    dispatch(addPointRequest());
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pointData),
      });
      if (!response.ok) {
        throw new Error("Failed to add point");
      }
      const data = await response.json();
      dispatch(addPointSuccess(data));
    } catch (error) {
      dispatch(addPointFailure(error.message));
    }
  };
};

export const updatePoint = (id, pointData) => {
  return async (dispatch) => {
    dispatch(updatePointRequest());
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pointData),
      });
      if (!response.ok) {
        throw new Error("Failed to update point");
      }
      const data = await response.json();
      dispatch(updatePointSuccess(data));
    } catch (error) {
      dispatch(updatePointFailure(error.message));
    }
  };
};

export const deletePoint = (id) => {
  return async (dispatch) => {
    dispatch(deletePointRequest());
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete point");
      }
      dispatch(deletePointSuccess(id));
    } catch (error) {
      dispatch(deletePointFailure(error.message));
    }
  };
};

export const fetchPointsBetweenDates = (startDate, endDate) => {
  return async (dispatch) => {
    dispatch(fetchPointsRequest());
    try {
      console.log(`Fetching points between ${startDate} and ${endDate}`); // Debug
      
      // First, fetch all points
      const response = await fetch(`http://localhost:5000/api/v1/points`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch points");
      }
      
      const allPoints = await response.json();
      console.log("All points:", allPoints.length); // Debug
      
      // Filter points by date client-side
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const filteredPoints = allPoints.filter(point => {
        if (!point.date) return false;
        
        const pointDate = new Date(point.date);
        return pointDate >= start && pointDate <= end;
      });
      
      console.log("Filtered points:", filteredPoints.length); // Debug
      
      dispatch(fetchPointsSuccess(filteredPoints));
      
      const pointIds = filteredPoints.map(point => point.entry_id);
      if (pointIds.length > 0) {
        dispatch(bulkFetchHasPictures(pointIds));
        dispatch(bulkFetchHasVideos(pointIds));
      }
    } catch (error) {
      console.error("Error in fetchPointsBetweenDates:", error);
      dispatch(fetchPointsFailure(error.message));
    }
  };
};

export const fetchAvailableDateRanges = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/points/date-ranges`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch available date ranges");
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch available date ranges");
      }
      
      return result.data;
    } catch (error) {
      console.error("Error fetching available date ranges:", error);
      return {
        availableYears: [],
        constraints: {}
      };
    }
  };
};
