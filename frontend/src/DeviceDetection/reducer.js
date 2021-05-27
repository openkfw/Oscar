export const SET_IS_MOBILE = 'SET_IS_MOBILE';

const defaultState = false;

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_IS_MOBILE:
      return action.payload;
    default:
      return state;
  }
};

export default {
  reducer,
};
