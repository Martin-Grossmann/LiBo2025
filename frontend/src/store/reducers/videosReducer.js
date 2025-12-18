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
} from "../actions/types";

const initialState = {
  items: [],
  loading: false,
  error: null,
  hasVideosInfo: {
    pointId: null,
    hasVideos: false,
    count: 0,
  },
  bulkHasVideosInfo: [],
};

const videosReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VIDEOS_REQUEST:
    case UPLOAD_VIDEO_REQUEST:
    case DELETE_VIDEO_REQUEST:
    case FETCH_HAS_VIDEOS_REQUEST:
    case BULK_FETCH_HAS_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    case UPLOAD_VIDEO_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
        // Update hasVideosInfo if the uploaded video is for the current pointId
        hasVideosInfo:
          state.hasVideosInfo.pointId === action.payload.pointId
            ? {
                ...state.hasVideosInfo,
                hasVideos: true,
                count: state.hasVideosInfo.count + 1,
              }
            : state.hasVideosInfo,
      };

    case DELETE_VIDEO_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter((video) => video.id !== action.payload),
      };

    case FETCH_HAS_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasVideosInfo: action.payload,
      };

    case BULK_FETCH_HAS_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        bulkHasVideosInfo: action.payload,
      };

    case FETCH_VIDEOS_FAILURE:
    case UPLOAD_VIDEO_FAILURE:
    case DELETE_VIDEO_FAILURE:
    case FETCH_HAS_VIDEOS_FAILURE:
    case BULK_FETCH_HAS_VIDEOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default videosReducer;
