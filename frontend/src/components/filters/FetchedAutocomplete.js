import axios from 'axios';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import { actions } from './actions';

const FetchedAutocomplete = ({ title, name, itemsSource, selectedValue, options, setFilterOptions, updateFilter }) => {
  useEffect(() => {
    async function fetchData() {
      const fetchedItems = await axios.get(itemsSource);
      let transformedOptions = [];
      if (fetchedItems.data && fetchedItems.data.length) {
        transformedOptions = fetchedItems.data.map((item, idx) => ({ label: item, id: idx }));
      }
      setFilterOptions(name, transformedOptions);
    }
    if (itemsSource && (!options || options.length === 0)) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsSource]);

  const onAutocompleteChange = (_, value, reason) => {
    if (reason === 'clear') {
      updateFilter(name, undefined);
    } else if (reason === 'select-option') {
      updateFilter(name, value.label);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      label={title}
      onChange={onAutocompleteChange}
      variant="standard"
      value={selectedValue}
      getOptionSelected={(option, value) => option.label === value.label}
      renderInput={(params) => (
        <TextField
          {...params}
          style={{ backgroundColor: 'rgba(0,0,0,0)', ...params.style }}
          InputLabelProps={{
            style: {
              ...params.InputLabelProps.style,
              zIndex: 1000,
              fontSize: '0.9rem',
              paddingLeft: '10px',
            },
            ...params.InputLabelProps,
          }}
          InputProps={{
            ...params.InputProps,
            style: {
              ...params.InputProps.style,
              backgroundColor: 'rgba(0,0,0,0)',
              borderBottom: '1px solid rgb(220, 220, 220)',
              marginTop: '0px',
            },
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            style: { backgroundColor: 'rgba(0,0,0,0)' },
            ...params.inputProps,
          }}
        />
      )}
    />
  );
};

FetchedAutocomplete.defaultProps = {
  selectedValue: undefined,
  options: [],
};

FetchedAutocomplete.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  itemsSource: PropTypes.string.isRequired,
  selectedValue: PropTypes.string || undefined,
  updateFilter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  setFilterOptions: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  selectedValue: state.getIn(['dashboardFilters', props.name, 'selectedValue']),
  options: state.getIn(['dashboardFilters', props.name, 'options'])
    ? state.getIn(['dashboardFilters', props.name, 'options']).toJSON()
    : [],
});
const mapDispatchToProps = {
  updateFilter: actions.updateFilter,
  setFilterOptions: actions.setFilterOptions,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchedAutocomplete);
