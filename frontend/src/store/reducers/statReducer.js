import {
  FETCH_STATS_REQUEST,
  FETCH_STATS_SUCCESS,
  FETCH_STATS_FAILURE
} from '../actions/statActions';

const initialState = {
  stats: null,
  loading: false,
  error: null
};

const statReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload
      };
    case FETCH_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default statReducer;
