import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { mainBackgroundColor, backgroundColor } from '../../muiTheme/colors';
import logo from '../../data/logo_orange.png';
import MenuList from './MenuList';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    backgroundColor: mainBackgroundColor,
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
    backgroundColor: mainBackgroundColor,
    zIndex: theme.zIndex.drawer + 1,
    width: drawerWidth,
    left: `-${drawerWidth}px`,
    boxShadow: 'none',
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: mainBackgroundColor,
  },
  content: {
    flexGrow: 1,
    padding: '28px',
    paddingTop: '16px',
    backgroundColor,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  headerToolbar: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
    },
  },
  headerTitle: {
    marginLeft: '10px',
  },
}));

export const Navbar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onLinkClick = (url) => {
    history.push(url);
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <div className={classes.drawerContainer}>
        <MenuList onLinkClick={onLinkClick} />
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.headerToolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.header}>
            <img alt="logo" src={logo} />
            <span className={classes.headerTitle}>Oscar</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Navbar;
