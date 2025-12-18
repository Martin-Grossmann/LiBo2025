import {
  FETCH_PICTURE_TAGS_REQUEST,
  FETCH_PICTURE_TAGS_SUCCESS,
  FETCH_PICTURE_TAGS_FAILURE,
  FETCH_TAGS_FOR_PICTURE_REQUEST,
  FETCH_TAGS_FOR_PICTURE_SUCCESS,
  FETCH_TAGS_FOR_PICTURE_FAILURE,
  FETCH_PICTURES_FOR_TAG_REQUEST,
  FETCH_PICTURES_FOR_TAG_SUCCESS,
  FETCH_PICTURES_FOR_TAG_FAILURE,
  ADD_TAG_TO_PICTURE_REQUEST,
  ADD_TAG_TO_PICTURE_SUCCESS,
  ADD_TAG_TO_PICTURE_FAILURE,
  REMOVE_TAG_FROM_PICTURE_REQUEST,
  REMOVE_TAG_FROM_PICTURE_SUCCESS,
  REMOVE_TAG_FROM_PICTURE_FAILURE,
  SEARCH_PICTURES_BY_TAGS_REQUEST,
  SEARCH_PICTURES_BY_TAGS_SUCCESS,
  SEARCH_PICTURES_BY_TAGS_FAILURE,
} from "../actions/types";

const initialState = {
  relationships: [],
  pictureTagsMap: {}, // Map of pictureId -> tags
  tagPicturesMap: {}, // Map of tagId -> pictures
  searchResults: [],
  loading: false,
  error: null,
};

const pictureTagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PICTURE_TAGS_REQUEST:
    case FETCH_TAGS_FOR_PICTURE_REQUEST:
    case FETCH_PICTURES_FOR_TAG_REQUEST:
    case ADD_TAG_TO_PICTURE_REQUEST:
    case REMOVE_TAG_FROM_PICTURE_REQUEST:
    case SEARCH_PICTURES_BY_TAGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PICTURE_TAGS_SUCCESS:
      return {
        ...state,
        loading: false,
        relationships: action.payload,
      };

    case FETCH_TAGS_FOR_PICTURE_SUCCESS:
      return {
        ...state,
        loading: false,
        pictureTagsMap: {
          ...state.pictureTagsMap,
          [action.payload.pictureId]: action.payload.tags,
        },
      };

    case FETCH_PICTURES_FOR_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        tagPicturesMap: {
          ...state.tagPicturesMap,
          [action.payload.tagId]: action.payload.pictures,
        },
      };

    case ADD_TAG_TO_PICTURE_SUCCESS: {
      const { relationship, tag } = action.payload;
      const pictureId = relationship.pictureId;
      const existingTags = state.pictureTagsMap[pictureId] || [];
      
      return {
        ...state,
        loading: false,
        relationships: [...state.relationships, relationship],
        pictureTagsMap: {
          ...state.pictureTagsMap,
          [pictureId]: [...existingTags, tag],
        },
      };
    }

    case REMOVE_TAG_FROM_PICTURE_SUCCESS: {
      const { pictureId, tagId, relationship } = action.payload;
      const existingTags = state.pictureTagsMap[pictureId] || [];
      
      return {
        ...state,
        loading: false,
        relationships: state.relationships.filter(
          (rel) => rel.id !== relationship.id
        ),
        pictureTagsMap: {
          ...state.pictureTagsMap,
          [pictureId]: existingTags.filter((tag) => tag.id !== tagId),
        },
      };
    }

    case SEARCH_PICTURES_BY_TAGS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload.pictures,
      };

    case FETCH_PICTURE_TAGS_FAILURE:
    case FETCH_TAGS_FOR_PICTURE_FAILURE:
    case FETCH_PICTURES_FOR_TAG_FAILURE:
    case ADD_TAG_TO_PICTURE_FAILURE:
    case REMOVE_TAG_FROM_PICTURE_FAILURE:
    case SEARCH_PICTURES_BY_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default pictureTagsReducer