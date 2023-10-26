const initialState = {
  groups: [{ from: 1, to: 10, todos: [] }]
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'UPDATE_GROUPS':
      return { ...state, groups: payload };

    default:
      return state;
  }
};

export default rootReducer;