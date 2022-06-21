import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import { buttonBackgroundColor } from '../../../muiTheme/colors';

import { actions as mapActions } from '../../../actions';

const mobileStyle = {
  position: 'fixed',
  right: 0,
  bottom: '78px',
};

const desktopStyle = {
  fontSize: '18.24px',
  position: 'relative',
  top: '2px',
};

const useStyles = () => ({
  button: {
    backgroundColor: buttonBackgroundColor,
  },
});

class GeolocationButton extends React.Component {
  getGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(this.onGeoSuccess);
    } else {
      // eslint-disable-next-line no-alert
      alert("Your browser or device doesn't support Geolocation");
    }
  };

  onGeoSuccess = (position) => {
    const coords = [position.coords.longitude, position.coords.latitude];
    this.props.setPointOfInterest(coords);
  };

  render() {
    const { isMobile, classes } = this.props;

    return (
      <Tooltip title="Find my position">
        {isMobile ? (
          <Fab color="primary" onClick={() => this.getGPSLocation()} style={mobileStyle}>
            <Icon>gps_fixed</Icon>
          </Fab>
        ) : (
          <button className={`locationBtn ${classes.button}`} onClick={() => this.getGPSLocation()} type="button">
            <Icon style={desktopStyle}>gps_fixed</Icon>
          </button>
        )}
      </Tooltip>
    );
  }
}

GeolocationButton.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  setPointOfInterest: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setPointOfInterest: mapActions.setPointOfInterest,
};

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(GeolocationButton));
