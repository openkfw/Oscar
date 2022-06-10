import { fromJS } from 'immutable';

export const SET_FILTERS = 'SET_FILTERS';
export const SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';
export const CLEAR_FILTERED_VALUES = 'CLEAR_FILTERED_VALUES';

export const actions = {};

actions.setFilters = (config) => ({
  type: SET_FILTERS,
  payload: config,
});

actions.setFilterOptions = (filterName, options) => ({
  type: SET_FILTER_OPTIONS,
  payload: {
    name: filterName,
    options,
  },
});

actions.updateFilter = (filterName, newValue) => ({
  type: UPDATE_FILTER,
  payload: {
    name: filterName,
    value: newValue,
  },
});

actions.clearFilter = (filterName) => ({
  type: CLEAR_FILTER,
  payload: {
    name: filterName,
  },
});

actions.clearAllFilters = () => ({
  type: CLEAR_FILTERED_VALUES,
});

const defState = fromJS({});
export const reducer = (state = defState, action) => {
  switch (action.type) {
    case SET_FILTERS:
      return fromJS(action.payload);
    case SET_FILTER_OPTIONS:
      return state.setIn([action.payload.name, 'options'], fromJS(action.payload.options));
    case UPDATE_FILTER:
      return state.setIn([action.payload.name, 'selectedValue'], fromJS(action.payload.value));
    case CLEAR_FILTER:
      return state.setIn([action.payload.name, 'selectedValue'], undefined);
    case CLEAR_FILTERED_VALUES:
      // eslint-disable-next-line no-case-declarations
      const newState = state;
      Object.keys(newState).forEach((key) => newState.setIn([key, 'selectedValue'], undefined));
      return newState;
    default:
      return state;
  }
};
