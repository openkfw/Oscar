import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { getAttributesData } from '../../axiosRequests';
import DistributionPlot from '../styledGraphComponents/DistributionPlot';
import { AGE_CATEGORIES, SEX_CATEGORIES } from '../../constants/dashboardConstants';

const restructureApiItem = (item) => ({
  geoUnit: item.attributeId.includes('Country') || item.attributeId.includes('Admin0') ? 'National' : item.featureId, // Country will be changed for Admin0
  sex: SEX_CATEGORIES.find((cat) => item.attributeId.includes(cat)),
  age: AGE_CATEGORIES.find((cat) => item.attributeId.includes(cat)),
  value: item.valueType === 'number' ? parseFloat(item.value) : item.value,
});

const useStyles = makeStyles({
  chart: {
    paddingLeft: '12px',
    paddingRight: '12px',
  },
});

const TotalCasesDistributionGraph = ({ attributeCategories, graphsIds }) => {
  const classes = useStyles();
  const [data, setData] = useState(undefined);
  const [selectedProvince, setSelectedProvince] = useState(undefined);

  const [provinceGraphData, setProvinceGraphData] = useState([]);
  const [ageGraphData, setAgeGraphData] = useState([]);

  // fetch data from api
  useEffect(() => {
    async function fetchTotalData(attributeCategories, setData) {
      const searchParams = new URLSearchParams();
      attributeCategories.map((attr) => searchParams.append('attributeIdCategory', attr));
      searchParams.append('latestValues', true);
      const data = await getAttributesData(searchParams);
      if (data && data.length > 0) {
        const origData = Object.keys(data[0])
          .map((attributeId) => {
            return data[0][attributeId].map((dt) => restructureApiItem(dt));
          })
          .flat();
        setData(origData);
      }
    }
    fetchTotalData(attributeCategories, setData);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //  set data for province graph
  useEffect(() => {
    if (!data) {
      return undefined;
    }
    const reorderData = (sex) => {
      const filteredData = data.filter((item) => item.sex === sex && item.age);
      const reducedData = filteredData.reduce((acc, curr) => {
        if (curr.geoUnit in acc) {
          acc[curr.geoUnit] += curr.value;
        } else {
          acc[curr.geoUnit] = curr.value;
        }
        return acc;
      }, {});
      return Object.entries(reducedData).map((entry) => ({
        province: entry[0],
        total: entry[1],
      }));
    };
    const maleData = reorderData('Male');
    const femaleData = reorderData('Female');

    setProvinceGraphData([
      {
        data: maleData,
        name: 'Male',
        orientation: 'v',
        type: 'bar',
        marker: {
          color: 'darkgreen',
        },
      },
      {
        data: femaleData,
        name: 'Female',
        orientation: 'v',
        type: 'bar',
        marker: {
          color: '#1f77b4',
        },
      },
    ]);
  }, [data]);

  // set data for age graph
  useEffect(() => {
    if (!selectedProvince || !data) {
      return;
    }
    const maleAgeCategories = {};
    const femaleAgeCategories = {};
    AGE_CATEGORIES.forEach((age) => (maleAgeCategories[age] = 0)); // eslint-disable-line no-return-assign
    AGE_CATEGORIES.forEach((age) => (femaleAgeCategories[age] = 0)); // eslint-disable-line no-return-assign
    data
      .filter((item) => item.geoUnit === selectedProvince)
      .forEach((item) => {
        if (item.age) {
          // items without age can be aggregated data we don't want to include
          if (item.sex === 'Male') {
            maleAgeCategories[item.age] = item.value;
          }
          if (item.sex === 'Female') {
            femaleAgeCategories[item.age] = item.value;
          }
        }
      }); // eslint-disable-line no-return-assign

    const maleAgeData = Object.entries(maleAgeCategories).map((entry) => ({ age: entry[0], total: entry[1] }));
    const femaleAgeData = Object.entries(femaleAgeCategories).map((entry) => ({ age: entry[0], total: entry[1] }));

    setAgeGraphData([
      {
        data: maleAgeData,
        name: 'Male',
        orientation: 'v',
        type: 'bar',
        marker: {
          color: 'darkgreen',
        },
      },
      {
        data: femaleAgeData,
        name: 'Female',
        orientation: 'v',
        type: 'bar',
        marker: {
          color: '#1f77b4',
        },
      },
    ]);
  }, [data, selectedProvince]);

  const onBarClick = (evt) => {
    setSelectedProvince(evt);
  };

  return (
    <Grid container direction="row" alignItems="center">
      <Grid item xs={12} md={6} className={classes.chart}>
        <DistributionPlot
          id={graphsIds.admin0}
          data={provinceGraphData}
          xAxisTitle="Province"
          yAxisTitle="Number of cases"
          title="Case distribution by province and sex"
          xAxisField="province"
          yAxisField="total"
          onBarClick={(evt) => onBarClick(evt.x)}
          emptyChartMessage="No data available"
          barmode="stack"
        />
      </Grid>
      <Grid item xs={12} md={6} className={classes.chart}>
        <DistributionPlot
          id={graphsIds.admin1}
          data={ageGraphData}
          xAxisTitle="Age"
          yAxisTitle="Number of cases"
          title={`Case distribution in province ${selectedProvince || ''} by age`}
          xAxisField="age"
          yAxisField="total"
          emptyChartMessage="Click on province bar on the left to see detailed values by age"
          hidden={!selectedProvince}
          barmode="stack"
          onHoverCursor="crosshair"
        />
      </Grid>
    </Grid>
  );
};

export default TotalCasesDistributionGraph;
