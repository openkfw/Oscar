import { SET_IS_MOBILE } from './reducer';

export const setIsMobile = (boolValue) => ({
  type: SET_IS_MOBILE,
  payload: boolValue,
});
