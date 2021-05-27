import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import TotalCasesDistributionGraph from '../../graphs/covid19Graphs/TotalCasesDistribution';
import CasesPerDayByProvince from '../../graphs/covid19Graphs/CasesPerDayByProvince';
import SevenDaysIncidenceRate from '../../graphs/covid19Graphs/SevenDaysIncidenceRate';
import CurrentCovid19Situation from '../../graphs/covid19Graphs/CurrentCovid19Situation';

const useStyles = makeStyles({
  chart: {
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  charts: {
    paddingTop: 0,
  },
});

const PublicTab = (props) => {
  const classes = useStyles();
  const { config } = props;

  return (
    <Grid container direction="row" alignItems="center">
      <Grid item xs={12} md={12}>
        <CurrentCovid19Situation
          attributeIds={{
            NEW_CASES_TOTAL: config.attributeIds.NEW_CASES_TOTAL,
            DEATHS_TOTAL: config.attributeIds.DEATHS_TOTAL,
            INFECTED_TOTAL: config.attributeIds.INFECTED_TOTAL,
            RECOVERED_TOTAL: config.attributeIds.RECOVERED_TOTAL,
            DEATH_YESTERDAY_INCREASE: config.attributeIds.DEATH_YESTERDAY_INCREASE,
            RECOVERED_YESTERDAY_INCREASE: config.attributeIds.RECOVERED_YESTERDAY_INCREASE,
            NEW_CASE_YESTERDAY_INCREASE: config.attributeIds.NEW_CASE_YESTERDAY_INCREASE,
          }}
        />
      </Grid>
      <Grid item xs={12} md={12} className={classes.chart}>
        <SevenDaysIncidenceRate attributeId={config.attributeIds.SEVEN_DAYS_COINCIDENCE} />
      </Grid>
      <Grid item xs={12} md={12} className={classes.chart}>
        <CasesPerDayByProvince attributeId={config.attributeIds.CASES_BY_DAY_PROVINCES} />
      </Grid>
      <Grid item xs={12} md={12} className={classes.charts}>
        <TotalCasesDistributionGraph
          attributeCategories={[config.attributeIds.TOTAL_CASES_PER_ADMIN0, config.attributeIds.TOTAL_CASES_PER_ADMIN1]}
        />
      </Grid>
    </Grid>
  );
};

export default PublicTab;
