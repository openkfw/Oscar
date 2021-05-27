import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';

const styles = {
  root: {
    width: 'auto',
    height: 'auto',
    minWidth: 'auto',
    minHeight: 'auto',
    backgroundColor: 'initial',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0) !important',
    },
    boxShadow: 'initial',
  },
  primary: {
    backgroundColor: 'initial',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
};

const FabIconButton = React.forwardRef(function FabIconButton(props, ref) {
  const { classes } = props;
  return <Fab className={classes.root} {...props} ref={ref} />;
});

FabIconButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withStyles(styles)(FabIconButton);
