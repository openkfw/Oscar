import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { getAttributesData } from '../../axiosRequests';
import {
  dashboardChartRedColor,
  dashboardChartGreenColor,
  dashboardChartYellowColor,
  dashboardChartBlueColor,
  dashboardChartPurpleColor,
  dashboardChartLightBlueColor,
} from '../../muiTheme/colors';
import { hasFilters } from '../../utils/dateAndAttributeUtils';
import EmptyChartMessage from '../EmptyChartMessage';
import LinePlot from './LinePlot';

const FilteredLinePlot = ({ id, attributeId, filteredFeatureId, title, yAxisTitle, filters, classes }) => {
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const searchParams = new URLSearchParams();
      searchParams.append('attributeId', attributeId);
      if (!hasFilters(filters)) {
        return;
      }
      if (filteredFeatureId) {
        searchParams.append('featureId', filteredFeatureId);
      }
      const data = await getAttributesData(searchParams);
      if (data) {
        const dataByFeature = {};
        data.forEach((feature) => {
          if (feature.featureId in dataByFeature) {
            dataByFeature[feature.featureId].push(feature);
          } else {
            dataByFeature[feature.featureId] = [feature];
          }
        });
        const plotData = Object.keys(dataByFeature).map((featureId) => ({
          administrativeUnit: featureId,
          years: dataByFeature[featureId].map((feature) => feature.date.substring(0, 4)),
          values: dataByFeature[featureId].map((feature) => feature.value),
        }));
        if (isMounted) {
          setLineChartData(plotData);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [attributeId, filteredFeatureId, filters]);

  if (!hasFilters(filters)) {
    return (
      <Grid item xs={12} md={6} className={classes.chart}>
        <EmptyChartMessage title="Please select filters to see this graph." />
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={6} className={classes.chart}>
      <LinePlot
        id={id}
        title={title}
        data={lineChartData}
        xAxisTitle="Period"
        yAxisTitle={yAxisTitle}
        xAxisField="years"
        yAxisField="values"
        lineNameField="administrativeUnit"
        mode="lines+markers"
        colors={[
          dashboardChartRedColor,
          dashboardChartGreenColor,
          dashboardChartYellowColor,
          dashboardChartBlueColor,
          dashboardChartPurpleColor,
          dashboardChartLightBlueColor,
        ]}
      />
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  filteredFeatureId: state.getIn(['dashboardFilters', 'featureId', 'selectedValue']),
  filters: state.getIn(['dashboardFilters']),
});
export default connect(mapStateToProps)(FilteredLinePlot);
