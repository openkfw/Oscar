/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

// import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { reducer as overview } from '../actions';
import { reducer as pixelDetails } from '../ol/info/actions';
import { reducer as isMobile } from '../DeviceDetection/reducer';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    overview,
    pixelDetails,
    isMobile,
    ...asyncReducers,
  });
}
