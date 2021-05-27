/* eslint-disable import/no-cycle */
import { fromJS } from 'immutable';
import { NO_ACTIVITY, SELECT_LAYERS as ACTIVITY_SELECT_LAYERS } from './constants/currentActivity';

export const SET_CURRENT_ACTIVITY = 'SET_CURRENT_ACTIVITY';
export const SHOW_POINT_OF_INTEREST = 'SHOW_POINT_OF_INTEREST';
export const CLEAR_POINT_OF_INTEREST = 'CLEAR_POINT_OF_INTEREST';
export const SELECT_LAYERS = 'SELECT_LAYERS';
export const CANCEL_SELECTING_LAYERS = 'CANCEL_SELECTING_LAYERS';
export const SET_ASSIGNING = 'SET_ASSIGNING';
export const CANCEL_ASSIGNING = 'CANCEL_ASSIGNING';
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';

export const actions = {};
actions.setCurrentActivity = (activity) => ({
  type: SET_CURRENT_ACTIVITY,
  payload: activity,
});

actions.setPointOfInterest = (coordinates) => ({
  type: SHOW_POINT_OF_INTEREST,
  payload: { coordinates },
});

actions.clearPointOfInterest = () => (dispatch) => {
  dispatch({ type: CLEAR_POINT_OF_INTEREST });
};

actions.selectLayers = () => ({
  type: SELECT_LAYERS,
});

actions.cancelSelectingLayers = () => ({
  type: SET_CURRENT_ACTIVITY,
  payload: NO_ACTIVITY,
});

actions.closeSidebar = () => ({
  type: CLOSE_SIDEBAR,
});

export const reducer = (
  state = fromJS({
    currentActivity: NO_ACTIVITY,
  }),
  action,
) => {
  switch (action.type) {
    case SET_CURRENT_ACTIVITY:
      return state.set('currentActivity', action.payload);
    case SHOW_POINT_OF_INTEREST:
      return state.set('pointOfInterest', action.payload.coordinates);
    case CLEAR_POINT_OF_INTEREST:
      return state.delete('pointOfInterest');
    case SELECT_LAYERS:
      return state.set('currentActivity', ACTIVITY_SELECT_LAYERS);
    case CLOSE_SIDEBAR:
      // eslint-disable-next-line no-case-declarations
      const newState = state.set('currentActivity', NO_ACTIVITY);
      return newState.delete('pointOfInterest');
    default:
      return state;
  }
};

export default { reducer, actions };
