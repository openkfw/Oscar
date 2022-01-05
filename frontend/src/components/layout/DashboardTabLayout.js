import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';

import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { backgroundColor, dashboardDateColor, mainTextColor } from '../../utils/oscarMuiTheme';
import generatePdf from '../../utils/generatePdf';

import OscarGraph from '../../graphs/OscarGraph';
import DashboardFilter from '../filters/DashboardFilter';

const useStyles = makeStyles({
  chart: {
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  charts: {
    paddingTop: 0,
  },
  date: {
    color: dashboardDateColor,
  },
  wholeDate: {
    marginRight: '12px',
    color: mainTextColor,
    textAlign: 'right',
    width: 'inherit',
    backgroundColor,
    padding: '2px',
  },
  printButton: {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    zIndex: 99999,
  },
  commentButton: {
    position: 'fixed',
    bottom: '10px',
    left: '100px',
    zIndex: 99999,
  },
});

const DashboardTab = ({ date, filters, graphs, printGraphs, kids, ...props }) => {
  const classes = useStyles();

  const basePrintComponents = [
    {
      htmlId: 'tabs-captions',
      type: 'htmlViaCanvas',
    },
    // {
    //   htmlId: 'dashboardTabDate',
    //   type: 'htmlViaCanvas',
    // },
  ];

  const getPdf = async () => {
    await generatePdf([...basePrintComponents, ...printGraphs], { textColor: mainTextColor });
  };

  return (
    <Grid container direction="row" alignItems="center">
      {/* <Grid item className={classes.wholeDate} id="dashboardTabDate">
          <span className={classes.date}>Date:</span> {date || 'n/a'}
        </Grid> */}
      <Grid item xs={12}>
        {filters && (
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            style={{ paddingTop: '0px', paddingBottom: '10px' }}>
            {filters.map((filter) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={filter.name} style={{ paddingTop: '0px' }}>
                <DashboardFilter config={filter} />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        {graphs && graphs.map((graph) => <OscarGraph {...graph} />)}
      </Grid>
      {kids.map((child) => (
        <Grid item xs={12} md={12} key={child.key}>
          {child}
        </Grid>
      ))}
      {props.isPrint && props.isPrint !== 'writingComment' ? (
        <Fab
          color="primary"
          key="printButton"
          className={classes.printButton}
          onClick={props.isPrint === 'print' ? getPdf : props.onFabClick}>
          {props.isPrint === 'print' ? (
            'PDF'
          ) : (
            <Icon style={{ paddingLeft: '2px' }} className="icon-activity_reporting " />
          )}
        </Fab>
      ) : (
        ''
      )}
    </Grid>
  );
};

DashboardTab.defaultProps = {
  date: new Date(Date.now()).toISOString().split('T')[0],
  filters: [],
  graphs: [],
  printGraphs: undefined,
  kids: [],
};

DashboardTab.propTypes = {
  date: PropTypes.string,
  printGraphs: PropTypes.arrayOf(PropTypes.shape({ htmlId: PropTypes.string })),
  filters: PropTypes.arrayOf(PropTypes.object),
  graphs: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  kids: PropTypes.arrayOf(PropTypes.any),
};

export default DashboardTab;
