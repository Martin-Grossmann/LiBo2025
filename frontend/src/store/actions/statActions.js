// Action Types
export const FETCH_STATS_REQUEST = 'FETCH_STATS_REQUEST';
export const FETCH_STATS_SUCCESS = 'FETCH_STATS_SUCCESS';
export const FETCH_STATS_FAILURE = 'FETCH_STATS_FAILURE';

// Action Creators
export const fetchStatsRequest = () => ({
  type: FETCH_STATS_REQUEST
});

export const fetchStatsSuccess = (stats) => ({
  type: FETCH_STATS_SUCCESS,
  payload: stats
});

export const fetchStatsFailure = (error) => ({
  type: FETCH_STATS_FAILURE,
  payload: error
});

// Helper function to calculate average speed in knots (distance/24)
const calculateAverageSpeed = (data) => {
  // If data is an array of distance objects
  if (Array.isArray(data)) {
    return data.map(item => {
      const distance = typeof item === 'object' ? (item.distance || 0) : item;
      return {
        ...item,
        averageSpeed: (distance / 24).toFixed(2) // Calculate average speed in knots
      };
    });
  } 
  // If data has a distances array
  else if (data && data.distances && Array.isArray(data.distances)) {
    const processedDistances = data.distances.map(item => {
      const distance = typeof item === 'object' ? (item.distance || 0) : item;
      return {
        ...item,
        averageSpeed: (distance / 24).toFixed(2) // Calculate average speed in knots
      };
    });
    
    return {
      ...data,
      distances: processedDistances,
      // Also calculate overall average speed if totalDistance exists
      averageSpeed: data.totalDistance ? (data.totalDistance / 24).toFixed(2) : 0
    };
  } 
  // If data has just totalDistance
  else if (data && data.totalDistance) {
    return {
      ...data,
      averageSpeed: (data.totalDistance / 24).toFixed(2) // Calculate average speed in knots
    };
  }
  
  // Return original data if none of the above conditions match
  return data;
};

// Thunk Action to fetch stats
export const fetchStats = () => {
  return async (dispatch) => {
    dispatch(fetchStatsRequest());
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/stats/largest-distances`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      
      let data = await response.json();
      
      // Calculate average speed in knots (distance/24)
      data = calculateAverageSpeed(data);
      
      //console.log("Processed stats data with average speed:", data);
      dispatch(fetchStatsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchStatsFailure(error.message));
      throw error;
    }
  };
};

// Thunk Action to fetch longest navigations
export const fetchLongestNavigations = () => {
  return async (dispatch) => {
    dispatch(fetchStatsRequest());
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/stats/longest-navigations`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch longest navigations");
      }
      
      let data = await response.json();
      
      // Calculate average speed in knots (distance/24)
      data = calculateAverageSpeed(data);
      
      //console.log("Processed longest navigations data with average speed:", data);
      dispatch(fetchStatsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchStatsFailure(error.message));
      throw error;
    }
  };
};

// Thunk Action to fetch longest stops (escales)
export const fetchLongestStops = () => {
  return async (dispatch) => {
    console.log("Starting fetchLongestStops");
    dispatch(fetchStatsRequest());
    
    try {
      console.log("Fetching from API: http://localhost:5000/api/v1/stats/longest-stops");
      const response = await fetch(`http://localhost:5000/api/v1/stats/longest-stops`);
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error("Failed to fetch longest stops");
      }
      
      let data = await response.json();
      console.log("Longest stops data:", data);
      
      if (data.stops) {
        console.log("Number of stops:", data.stops.length);
        console.log("First stop:", data.stops[0]);
      } else {
        console.log("No stops data found in response");
      }
      
      dispatch(fetchStatsSuccess(data));
      return data;
    } catch (error) {
      console.error("Error in fetchLongestStops:", error);
      dispatch(fetchStatsFailure(error.message));
      throw error;
    }
  };
};
