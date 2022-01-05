import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { mainBackgroundColor, mainTextColor } from '../../utils/oscarMuiTheme';
import ProgressIndicator from '../ProgressIndicator';
import EmptyChartMessage from '../EmptyChartMessage';

const Plot = createPlotlyComponent(Plotly);

const OverviewPlot = ({ id, data, categories, title }) => {
  if (!data) {
    return <ProgressIndicator />;
  }
  if (data.length === 0) {
    return <EmptyChartMessage title="No data available" />;
  }

  const getDataForOverviewPlot = () => {
    const parents = [];
    const values = [];
    const labels = [];
    const counts = {
      parents: [],
      labels: [],
      values: [],
    };

    categories.forEach(({ label, key }, idx) => {
      counts.values[idx] = 0;
      counts.parents.push('');
      counts.labels.push(label);
      data.forEach((item) => {
        counts.values[idx] += +item[key];
        labels.push(item.administrativeUnit);
        parents.push(label);
        values.push(item[key]);
      });
    });

    const allParents = [...counts.parents, ...parents];
    const allValues = [...counts.values, ...values];
    const allLabels = [...counts.labels, ...labels];

    const plotData = [
      {
        type: 'sunburst',
        labels: allLabels,
        parents: allParents,
        values: allValues,
        leaf: { opacity: 0.4 },
        marker: {
          colors: ['#1F76B4', '#006300', '#8B0100'],
        },
        branchvalues: 'total',
        hoverinfo: 'label+value',
        textinfo: 'value',
        textfont: {
          color: 'white',
          size: 16,
        },
        hoverlabel: {
          bgcolor: 'black',
          bordercolor: 'black',
          font: {
            color: 'white',
            size: 12,
          },
        },
      },
    ];

    return plotData;
  };

  return (
    <Plot
      divId={id}
      data={getDataForOverviewPlot()}
      layout={{
        plot_bgcolor: mainBackgroundColor,
        paper_bgcolor: mainBackgroundColor,
        title: {
          text: title,
          font: {
            color: mainTextColor,
            size: 18,
          },
        },
        modebar: {
          color: mainTextColor,
        },
      }}
      config={{ displayModeBar: 'True' }}
      style={{
        width: '100%',
        height: '100%',
      }}
      useResizeHandler
    />
  );
};

OverviewPlot.defaultProps = {
  data: null,
};

OverviewPlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default memo(OverviewPlot);
