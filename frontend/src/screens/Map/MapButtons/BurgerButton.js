import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';

import { actions as mapActions } from '../../../actions';
import { MENU_OPENED, NO_ACTIVITY } from '../../../constants/currentActivity';
import { lightTextColor, accentColor } from '../../../oscarMuiTheme';

const BurgerButton = ({ isMobile, menuOpened, openMenu }) => {
  const desktopStyle = {
    color: menuOpened ? accentColor.main : lightTextColor,
  };

  return (
    <Tooltip title={menuOpened ? 'Close menu' : 'Open menu'}>
      <Fab
        {...(!isMobile && { size: 'small' })}
        style={desktopStyle}
        color="primary"
        onClick={menuOpened ? () => openMenu(NO_ACTIVITY) : () => openMenu(MENU_OPENED)}>
        <Icon>menu</Icon>
      </Fab>
    </Tooltip>
  );
};

BurgerButton.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  menuOpened: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  menuOpened: state.getIn(['overview', 'currentActivity']) === MENU_OPENED,
});

const mapDispatchToProps = {
  openMenu: mapActions.setCurrentActivity,
};

export default connect(mapStateToProps, mapDispatchToProps)(BurgerButton);
