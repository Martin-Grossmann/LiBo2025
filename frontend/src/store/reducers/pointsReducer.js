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
} from "../actions/types";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const pointsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POINTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_POINTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case FETCH_POINTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_POINT_REQUEST:
    case UPDATE_POINT_REQUEST:
    case DELETE_POINT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_POINT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
      };
    case UPDATE_POINT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map((point) =>
          point.id === action.payload.id ? action.payload : point
        ),
      };
    case DELETE_POINT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter((point) => point.id !== action.payload),
      };
    case ADD_POINT_FAILURE:
    case UPDATE_POINT_FAILURE:
    case DELETE_POINT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default pointsReducer;
