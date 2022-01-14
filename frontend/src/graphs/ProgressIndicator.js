import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  progressIndicator: {
    marginLeft: '50%',
  },
}));

const ProgressIndicator = () => {
  const classes = useStyles();

  return <CircularProgress className={classes.progressIndicator} />;
};

export default ProgressIndicator;
