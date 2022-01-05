import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

import MuiMenuItem from '@material-ui/core/MenuItem';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

import { lightTextColor, accentColor, buttonBackgroundColor } from '../../../utils/oscarMuiTheme';

const useStyles = makeStyles((theme) => ({
  popover: {
    marginRight: theme.spacing(2),
    transform: 'translate(-10px)',
  },
}));

const MenuItem = withStyles({
  root: {
    justifyContent: 'center',
  },
})(MuiMenuItem);

export const BasemapsButton = ({ mapLayers, switchMapLayers }) => {
  const desktopStyle = {
    bottom: 140,
    fontSize: '18.24px',
    backgroundColor: buttonBackgroundColor,
  };

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, idx) => {
    switchMapLayers(mapLayers[idx].get('title'));
  };

  return (
    <>
      <Tooltip title="Change basemap">
        <button
          style={desktopStyle}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className="locationBtn"
          type="button">
          <Icon style={desktopStyle}>public</Icon>
        </button>
      </Tooltip>
      <Popover
        className={classes.popover}
        open={open}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}>
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList autoFocusItem={open} id="menu-list-grow">
            {mapLayers.map((mapLayer, idx) => {
              return (
                <MenuItem
                  style={{ color: mapLayer.get('visible') ? accentColor.main : lightTextColor }}
                  key={mapLayer.get('title')}
                  onClick={(event) => handleListItemClick(event, idx)}>
                  {mapLayer.get('title')}
                </MenuItem>
              );
            })}
          </MenuList>
        </ClickAwayListener>
      </Popover>
    </>
  );
};

BasemapsButton.propTypes = {
  mapLayers: PropTypes.arrayOf(PropTypes.any).isRequired,
  switchMapLayers: PropTypes.func.isRequired,
};

export default BasemapsButton;
