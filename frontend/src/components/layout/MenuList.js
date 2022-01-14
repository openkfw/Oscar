import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { mainTextColor, accentColor } from '../../utils/oscarMuiTheme';
import { MAP_PAGE, EXEC_DASHBOARD_PAGE } from '../../routes';

const useStyles = makeStyles(() => ({
  link: {
    color: mainTextColor,
  },
  activeLink: {
    color: accentColor.main,
  },
}));

export const MenuList = ({ onLinkClick }) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <List>
      <ListItem button className={classes.link} onClick={() => onLinkClick(MAP_PAGE)}>
        <ListItemText
          classes={{
            primary: location.hash.includes('#map') ? classes.activeLink : classes.link,
          }}
          primary="Map"
        />
      </ListItem>
      <ListItem button onClick={() => onLinkClick(EXEC_DASHBOARD_PAGE)}>
        <ListItemText
          classes={{
            primary: location.pathname === EXEC_DASHBOARD_PAGE ? classes.activeLink : classes.link,
          }}
          primary="Dashboard"
        />
      </ListItem>
    </List>
  );
};

MenuList.propTypes = {
  onLinkClick: PropTypes.func.isRequired,
};

export default MenuList;
