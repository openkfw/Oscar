import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router';
import connect from 'react-redux/lib/connect/connect';
import Drawer from '@material-ui/core/Drawer';
import { actions as mapActions } from '../../actions';
import { NO_ACTIVITY, MENU_OPENED } from '../../constants/currentActivity';
import { mainBackgroundColor } from '../../utils/oscarMuiTheme';
import MenuList from './MenuList';

const useStyles = makeStyles(() => ({
  sideMenu: {
    boxSizing: 'border-box',
    position: 'fixed',
    top: '64px',
    left: 0,
    zIndex: 2,
    width: '330px',
    height: 'calc(100% - 64px)',
    overflowY: 'auto',
    paddingLeft: '0px',
    paddingRight: '0px',
    backgroundColor: mainBackgroundColor,
  },
}));

const SideMenu = ({ closeMenu, isMobile, menuOpened }) => {
  const classes = useStyles();
  const history = useHistory();

  const onLinkClick = (url) => {
    closeMenu(NO_ACTIVITY);
    history.push(url);
  };

  return !isMobile ? (
    <Paper className={classes.sideMenu} square>
      <Grid container direction="column">
        <Grid container className="featureDetail">
          <Grid item xs={12}>
            <MenuList onLinkClick={onLinkClick} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  ) : (
    <nav aria-label="mailbox folders">
      <Drawer
        variant="temporary"
        anchor="right"
        open={menuOpened}
        onClose={() => closeMenu(NO_ACTIVITY)}
        ModalProps={{
          keepMounted: true,
        }}>
        <div>
          <MenuList onLinkClick={onLinkClick} />
        </div>
      </Drawer>
    </nav>
  );
};

SideMenu.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  menuOpened: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isMobile: state.get('isMobile'),
  menuOpened: state.getIn(['overview', 'currentActivity']) === MENU_OPENED,
});

const mapDispatchToProps = {
  closeMenu: mapActions.setCurrentActivity,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
