import React, { useState, useEffect } from 'react';

import LinePlot from '../styledGraphComponents/LinePlot';
import { getAttributesData } from '../../axiosRequests';
import { getStartDate } from '../../utils/helpers';
import {
  dashboardChartRedColor,
  dashboardChartGreenColor,
  dashboardChartYellowColor,
  dashboardChartBlueColor,
  dashboardChartPurpleColor,
  dashboardChartLightBlueColor,
} from '../../muiTheme/colors';

const SevenDaysIncidenceRate = ({ attributeId, id }) => {
  // 7 days incidence
  const [sevenDays, setSevenDays] = useState([]);
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const searchParams = new URLSearchParams();
      searchParams.append('attributeId', attributeId);
      searchParams.append('dateStart', getStartDate(7));
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
          dates: dataByFeature[featureId].map((feature) => feature.date),
          values: dataByFeature[featureId].map((feature) => feature.value),
        }));
        if (isMounted) {
          setSevenDays(plotData);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [attributeId]);

  return (
    <LinePlot
      id={id}
      title="7 day Covid-19 incidence per 100,000 population"
      data={sevenDays}
      yAxisTitle="Ratio"
      xAxisTitle="Period"
      xAxisField="dates"
      yAxisField="values"
      textField="administrativeUnit"
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
  );
};
export default SevenDaysIncidenceRate;
