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
} from "../actions/types";

const initialState = {
  items: [],
  loading: false,
  error: null,
  hasPicturesInfo: {
    pointId: null,
    hasPictures: false,
    count: 0,
  },
  bulkHasPicturesInfo: [],
};

const picturesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PICTURES_REQUEST:
    case UPLOAD_PICTURE_REQUEST:
    case DELETE_PICTURE_REQUEST:
    case FETCH_HAS_PICTURES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PICTURES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    case UPLOAD_PICTURE_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
        // Update hasPicturesInfo if the uploaded picture is for the current pointId
        hasPicturesInfo:
          state.hasPicturesInfo.pointId === action.payload.pointId
            ? {
                ...state.hasPicturesInfo,
                hasPictures: true,
                count: state.hasPicturesInfo.count + 1,
              }
            : state.hasPicturesInfo,
      };

    case DELETE_PICTURE_SUCCESS:
      const remainingPicturesForPoint = state.items
        .filter((pic) => pic.id !== action.payload)
        .filter((pic) => pic.pointId === state.hasPicturesInfo.pointId);

      return {
        ...state,
        loading: false,
        items: state.items.filter((picture) => picture.id !== action.payload),
        // Update hasPicturesInfo if the deleted picture was for the current pointId
        hasPicturesInfo:
          state.hasPicturesInfo.pointId &&
          state.items.find((pic) => pic.id === action.payload)?.pointId ===
            state.hasPicturesInfo.pointId
            ? {
                ...state.hasPicturesInfo,
                hasPictures: remainingPicturesForPoint.length > 0,
                count: remainingPicturesForPoint.length,
              }
            : state.hasPicturesInfo,
      };

    case FETCH_HAS_PICTURES_SUCCESS:
      return {
        ...state,
        loading: false,
        hasPicturesInfo: action.payload,
      };

    case FETCH_PICTURES_FAILURE:
    case UPLOAD_PICTURE_FAILURE:
    case DELETE_PICTURE_FAILURE:
    case FETCH_HAS_PICTURES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case BULK_FETCH_HAS_PICTURES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BULK_FETCH_HAS_PICTURES_SUCCESS:
      return {
        ...state,
        loading: false,
        bulkHasPicturesInfo: action.payload,
      };

    case BULK_FETCH_HAS_PICTURES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default picturesReducer;
