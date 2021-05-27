import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { actions as mapActions } from '../actions';
import { MENU_OPENED, NO_ACTIVITY } from '../constants/currentActivity';

export const MobileHeader = ({ isMobile, setCurrentActivity, menuOpened }) => {
  return isMobile ? (
    <div className="mobileHeader">
      <span className="mobileLogo" />
      <IconButton
        className="mobileMenu"
        onClick={menuOpened ? () => setCurrentActivity(NO_ACTIVITY) : () => setCurrentActivity(MENU_OPENED)}>
        <Icon>menu</Icon>
      </IconButton>
    </div>
  ) : null;
};

MobileHeader.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isMobile: state.get('isMobile'),
  menuOpened: state.getIn(['overview', 'currentActivity']) === MENU_OPENED,
});

const mapDispatchToProps = {
  setCurrentActivity: mapActions.setCurrentActivity,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader);
