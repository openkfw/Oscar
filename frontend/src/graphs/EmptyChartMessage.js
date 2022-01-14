import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { mainBackgroundColor, lightGreyTextColor } from '../utils/oscarMuiTheme';

const useStyles = makeStyles({
  root: {
    height: 450,
    backgroundColor: mainBackgroundColor,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: '0 40px',
  },
  title: {
    fontSize: 28,
    color: lightGreyTextColor,
  },
});

const EmptyChartMessage = ({ title }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      <Typography className={classes.title}>{title}</Typography>
    </Paper>
  );
};

EmptyChartMessage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default EmptyChartMessage;
