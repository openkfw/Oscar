/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-properties */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { colormaps } from '../../../ol/staticLayers/styles';

import { mapLegendTypes } from '../../../constants';

const useStyles = makeStyles(() => ({
  legendItem: {
    display: 'block',
    float: 'left',
    clear: 'both',
  },
  colorIcon: {
    width: '10px',
    height: '10px',
    borderRadius: '10px',
    padding: '2px',
    display: 'inline-block',
    marginLeft: '2px',
  },
  legendItemDescription: {
    display: 'inline-block',
    paddingLeft: '4px',
    paddingRight: '16px',
    lineHeight: '1.5rem',
  },
  colorRange: {
    width: '300px',
    clear: 'both',
    height: '10px',
    marginTop: '6px',
  },
  oneRangeColor: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    padding: '0px',
    margin: '0px',
  },
  min: {
    float: 'left',
    maxWidth: '40%',
  },
  max: {
    float: 'right',
    maxWidth: '40%',
  },
}));

const LegendItem = ({ legend }) => {
  const classes = useStyles();

  if (legend.type === mapLegendTypes.COLOR) {
    return (
      <div className={classes.legendItem}>
        <div className={classes.colorIcon} style={{ backgroundColor: legend.color }} />
        <Typography variant="body1" className={classes.legendItemDescription}>
          {legend.description}
        </Typography>
      </div>
    );
  }
  if (legend.type === mapLegendTypes.COLORMAP) {
    const colorRange = colormaps[legend.color];
    return (
      <div className={classes.legendItem}>
        <div className={classes.colorRange}>
          {Array(30)
            .fill(1)
            .map((_, y) => {
              const index = Math.round((1 - Math.pow(y / 30, 0.5)) * (50 - 1));
              return <div key={y} className={classes.oneRangeColor} style={{ backgroundColor: colorRange[index] }} />;
            })}
        </div>
        <p className={classes.min}>{legend.min}</p>
        <p className={classes.max}>{legend.max}</p>
        <Typography
          variant="body1"
          className={classes.legendItemDescription}
          style={{ display: 'block', clear: 'both' }}>
          {legend.description}
        </Typography>
      </div>
    );
  }
};

LegendItem.propTypes = {
  legend: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default LegendItem;
