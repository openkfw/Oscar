import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import OverviewPlot from '../styledGraphComponents/OverviewPlot';

const CasesByProvincePieChart = ({ sourceData, id }) => {
  const [csvDataActiveCases, setCsvDataActiveCases] = useState([]);

  useEffect(() => {
    // load active cases data into state
    async function fetchData() {
      Plotly.d3.csv(sourceData.path, (data) => {
        const overviewData = data.map((row) => {
          return {
            administrativeUnit: row[sourceData.attributes.administrativeUnit],
            activeCases: +row[sourceData.attributes.activeCases],
            recoveredCases: +row[sourceData.attributes.recoveredCases],
            deaths: +row[sourceData.attributes.deaths],
          };
        });

        const sortedData = overviewData
          .sort((a, b) => (+a.activeCases < +b.activeCases ? 1 : -1))
          .filter(
            (item) =>
              item.activeCases > 100 && item.activeCases !== '-' && item.recoveredCases !== '-' && item.deaths !== '-',
          );

        setCsvDataActiveCases(sortedData);
      });
    }
    fetchData();
  }, [sourceData]);

  return (
    <OverviewPlot
      id={id}
      data={csvDataActiveCases}
      categories={[
        { label: 'Active Cases', key: 'activeCases' },
        { label: 'Discharged', key: 'recoveredCases' },
        { label: 'Deaths', key: 'deaths' },
      ]}
      title="Cases by province"
    />
  );
};

export default CasesByProvincePieChart;
