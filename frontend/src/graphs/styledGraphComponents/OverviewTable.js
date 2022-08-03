import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Tooltip } from '@material-ui/core';
import {
  mainTextColor,
  dashboardDateColor,
  dashboardCardGreyColor,
  mainBackgroundColor,
  mainBoxShadow,
} from '../../utils/oscarMuiTheme';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%',
    height: '100%',
    color: mainTextColor,
    paddingBottom: '39px',
  },
  card: {
    width: '100%',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: mainTextColor,
    backgroundColor: mainBackgroundColor,
    padding: '30px',
    boxShadow: mainBoxShadow,
    margin: '0 12px',
  },
  rowTitle: {
    marginBottom: 0,
    marginLeft: '12px',
  },
  cardNumber: {
    fontSize: '1.85rem',
    overflowX: 'auto',
  },
  cardTitle: {
    fontSize: '1.1rem',
    width: '80%',
  },
  date: {
    color: dashboardDateColor,
  },
  wholeDate: {
    marginRight: '12px',
  },
  cardText: {
    color: dashboardCardGreyColor,
  },
  increaseText: {
    paddingTop: '10px',
  },
}));

const OverviewTable = ({ data, color, highlightedPrefix, primaryText, secondaryText }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Tooltip placement="top-start" arrow title={data.primaryValue || 'n/a'}>
        <span className={`${classes.cardNumber}`} style={{ color }}>
          {data.primaryValue === 0 ? 0 : data.primaryValue || 'n/a'}
        </span>
      </Tooltip>
      <span className={`${classes.cardTitle}`} style={{ color }}>
        {highlightedPrefix} <span className={classes.cardText}>{primaryText}</span>
      </span>
      {secondaryText && (
        <span className={classes.increaseText}>
          {`+ ${data.secondaryValue === 0 ? 0 : data.secondaryValue || 'n/a'}`}
          <span className={classes.cardText}> {secondaryText} from</span> previous day
        </span>
      )}
    </Card>
  );
};

OverviewTable.propTypes = {
  data: PropTypes.shape({}),
  color: PropTypes.string,
  highlightedPrefix: PropTypes.string,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
};

OverviewTable.defaultProps = {
  data: {
    primaryText: null,
    secondaryText: null,
  },
  color: 'rgba(243, 214, 62, 1)',
  highlightedPrefix: null,
  primaryText: null,
  secondaryText: null,
};

export default OverviewTable;
