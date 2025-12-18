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
} from "../actions/types";

const initialState = {
  items: [],
  currentTag: null,
  loading: false,
  error: null,
  categoryTags: []
};

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all tags
    case FETCH_TAGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_TAGS_SUCCESS:
      console.log("Reducer received payload for FETCH_TAGS_SUCCESS:", action.payload);
      return {
        ...state,
        loading: false,
        items: action.payload || [],
        error: null
      };
    case FETCH_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch single tag
    case FETCH_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTag: action.payload,
        error: null
      };
    case FETCH_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Create tag
    case CREATE_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CREATE_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
        error: null
      };
    case CREATE_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update tag
    case UPDATE_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map(tag => 
          tag.id === action.payload.id ? action.payload : tag
        ),
        currentTag: action.payload,
        error: null
      };
    case UPDATE_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete tag
    case DELETE_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter(tag => tag.id !== action.payload),
        error: null
      };
    case DELETE_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch tags by category
    case FETCH_TAGS_BY_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_TAGS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryTags: action.payload,
        error: null
      };
    case FETCH_TAGS_BY_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default tagsReducer;