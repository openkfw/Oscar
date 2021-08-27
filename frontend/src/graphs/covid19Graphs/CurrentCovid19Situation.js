import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { getAttributesData } from '../../axiosRequests';
import OverviewTable from '../styledGraphComponents/OverviewTable';
import { dashboardDateColor, mainTextColor } from '../../oscarMuiTheme';

const useStyles = makeStyles({
  rowTitle: {
    marginBottom: 0,
    marginLeft: '12px',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    color: mainTextColor,
    paddingBottom: '39px',
  },
  date: {
    color: dashboardDateColor,
  },
  wholeDate: {
    marginRight: '12px',
  },
});

const CurrentCovid19Situation = ({ attributeIds }) => {
  const classes = useStyles();
  const [overviewData, setOverviewData] = useState([]);

  useEffect(() => {
    // load overview data into state
    const overviewDataFetching = async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('attributeId', attributeIds.NEW_CASES_TOTAL);
      searchParams.append('attributeId', attributeIds.DEATHS_TOTAL);
      searchParams.append('attributeId', attributeIds.INFECTED_TOTAL);
      searchParams.append('attributeId', attributeIds.RECOVERED_TOTAL);
      searchParams.append('attributeId', attributeIds.DEATH_YESTERDAY_INCREASE);
      searchParams.append('attributeId', attributeIds.RECOVERED_YESTERDAY_INCREASE);
      searchParams.append('attributeId', attributeIds.NEW_CASE_YESTERDAY_INCREASE);
      searchParams.append('latestValues', true);
      try {
        const overviewChartData = await getAttributesData(searchParams);
        const chartData = {
          newCases: overviewChartData[0][attributeIds.NEW_CASE_YESTERDAY_INCREASE][0].value,
          recovered: overviewChartData[0][attributeIds.RECOVERED_YESTERDAY_INCREASE][0].value,
          deaths: overviewChartData[0][attributeIds.DEATH_YESTERDAY_INCREASE][0].value,
          dateTotal: overviewChartData[0][attributeIds.NEW_CASES_TOTAL][0].date.substring(
            0,
            overviewChartData[0][attributeIds.NEW_CASES_TOTAL][0].date.indexOf('T'),
          ),
          totalCases: overviewChartData[0][attributeIds.NEW_CASES_TOTAL][0].value,
          totalInfected: overviewChartData[0][attributeIds.INFECTED_TOTAL][0].value,
          totalRecovered: overviewChartData[0][attributeIds.RECOVERED_TOTAL][0].value,
          totalDeaths: overviewChartData[0][attributeIds.DEATHS_TOTAL][0].value,
        };
        setOverviewData(chartData);
      } catch {
        setOverviewData([]);
      }
    };
    overviewDataFetching();
  }, [attributeIds]);

  return (
    <Grid className={classes.wrapper} container direction="row" justifyContent="space-evenly" alignItems="flex-start">
      <Grid container item xs={12} direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item>
          <h3 className={classes.rowTitle}>Current Covid-19 situation</h3>
        </Grid>
        <Grid item className={classes.wholeDate}>
          <div>
            <span className={classes.date}>Date:</span> {overviewData.dateTotal || 'n/a'}
          </div>
        </Grid>
      </Grid>
      <Grid container item xs={12} direction="row" justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12} md={3}>
          <OverviewTable
            data={{
              primaryValue: overviewData.totalCases,
              secondaryValue: overviewData.newCases,
            }}
            highlightedPrefix="Total"
            primaryText="cases"
            secondaryText="cases"
            color="rgba(243, 214, 62, 1)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <OverviewTable
            data={{
              primaryValue: overviewData.totalRecovered,
              secondaryValue: overviewData.recovered,
            }}
            highlightedPrefix="Recovered"
            secondaryText="cases"
            color="rgba(87, 243, 62, 1)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <OverviewTable
            data={{
              primaryValue: overviewData.totalDeaths,
              secondaryValue: overviewData.deaths,
            }}
            highlightedPrefix="Deaths"
            secondaryText="cases"
            color="rgba(243, 62, 62, 1)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <OverviewTable
            data={{
              primaryValue: overviewData.totalInfected,
              secondaryValue: overviewData.newCases,
            }}
            highlightedPrefix="Currently"
            primaryText="infected"
            secondaryText="cases"
            color="rgba(243, 150, 62, 1)"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CurrentCovid19Situation;
