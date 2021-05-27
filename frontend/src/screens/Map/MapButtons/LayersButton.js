import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';

import { actions as mapActions } from '../../../actions';
import { SELECT_LAYERS } from '../../../constants/currentActivity';
import { lightTextColor, accentColor } from '../../../oscarMuiTheme';

export const LayerButton = ({ isMobile, selectingLayers, cancelSelecting, selectLayers }) => {
  const mobileStyle = {
    position: 'fixed',
    left: 0,
    bottom: '16px',
  };

  const desktopStyle = {
    color: selectingLayers ? accentColor.main : lightTextColor,
  };

  return (
    <Tooltip title={selectingLayers ? 'Deselect Layers' : 'Select layers'}>
      <Fab
        {...(!isMobile && { size: 'small' })}
        style={isMobile ? mobileStyle : desktopStyle}
        color="primary"
        onClick={selectingLayers ? cancelSelecting : selectLayers}>
        <Icon>layers</Icon>
      </Fab>
    </Tooltip>
  );
};

LayerButton.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  selectingLayers: PropTypes.bool.isRequired,
  cancelSelecting: PropTypes.func.isRequired,
  selectLayers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  selectingLayers: state.getIn(['overview', 'currentActivity']) === SELECT_LAYERS,
});

const mapDispatchToProps = {
  selectLayers: mapActions.selectLayers,
  cancelSelecting: mapActions.cancelSelectingLayers,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayerButton);
