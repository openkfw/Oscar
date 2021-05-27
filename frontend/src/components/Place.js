/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

const Place = ({ index, selectedIndex, placeName, navigateToPlace }) => (
  <MenuItem button selected={selectedIndex === index} onClick={navigateToPlace}>
    <Tooltip title={placeName} aria-label={placeName}>
      <ListItemText primary={placeName} />
    </Tooltip>
  </MenuItem>
);

Place.propTypes = {
  index: PropTypes.number,
  selectedIndex: PropTypes.number,
  placeName: PropTypes.string,
  navigateToPlace: PropTypes.func,
};

export default Place;
