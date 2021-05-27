import React, { useState, useEffect } from 'react';

import LinePlot from '../styledGraphComponents/LinePlot';
import { getAttributesData } from '../../axiosRequests';
import { getStartDate } from '../../helpers';
import {
  dashboardChartRedColor,
  dashboardChartGreenColor,
  dashboardChartYellowColor,
  dashboardChartBlueColor,
  dashboardChartPurpleColor,
  dashboardChartLightBlueColor,
} from '../../oscarMuiTheme';

const CasesPerDayByProvince = ({ attributeId }) => {
  const [casesByDayProvince, setCasesByDayProvince] = useState([]);
  useEffect(() => {
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
          dates: dataByFeature[featureId].map((feature) => feature.date.split('T')[0]),
          values: dataByFeature[featureId].map((feature) => feature.value),
        }));
        setCasesByDayProvince(plotData);
      }
    }
    fetchData();
  }, [attributeId]);

  return (
    <LinePlot
      title="Cases per day by province"
      data={casesByDayProvince}
      yAxisTitle="Number of cases"
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

export default CasesPerDayByProvince;
