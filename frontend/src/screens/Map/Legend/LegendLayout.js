/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Previous from '@material-ui/icons/KeyboardArrowLeft';
import Next from '@material-ui/icons/KeyboardArrowRight';
import { mainBackgroundColor } from '../../../muiTheme/colors';
import LegendItem from './LegendItem';
import LegendTitle from './LegendTitle';

const useStyles = makeStyles(() => ({
  legendPaper: {
    position: 'fixed',
    margin: 6,
    padding: '2px',
    paddingLeft: '10px',
    paddingTop: '0px',
    right: 6,
    top: 64,
    width: '330px',
    backgroundColor: mainBackgroundColor,
  },
  legendTitleBar: {
    clear: 'both',
    float: 'left',
    width: '100%',
  },
  navigationButton: {
    float: 'right',
  },
}));

const Legend = ({ data }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (page !== 0 && page > data.length - 1) {
      setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const setPageNumber = (newValue) => {
    const lastPage = data.length && data.length - 1;
    let updatedValue = newValue;
    if (newValue < 0) {
      updatedValue = lastPage + 1 + newValue;
    } else if (newValue > lastPage) {
      updatedValue = newValue - lastPage - 1;
    }
    setPage(updatedValue);
  };

  if (!data || !data.length) {
    return null;
  }

  const currentLegend = data[page] ? data[page] : data[0];

  return (
    <Paper square className={classes.legendPaper}>
      <div className={classes.legendTitleBar}>
        <LegendTitle title={currentLegend.layerTitle} />
        {data.length > 1 ? (
          <>
            <Next onClick={() => setPageNumber(page + 1)} className={classes.navigationButton} />
            <Previous onClick={() => setPageNumber(page - 1)} className={classes.navigationButton} />
          </>
        ) : null}
      </div>
      {currentLegend.legends.map((legend, idx) => (
        <LegendItem key={idx} legend={legend} classes={classes} />
      ))}
    </Paper>
  );
};

Legend.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Legend;
