const initialState = {
  currentPage: 'landing'
};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        ...state,
        currentPage: action.payload
      };
    default:
      return state;
  }
};

export default navigationReducer;