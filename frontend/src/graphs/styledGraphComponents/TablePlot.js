import React from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { mainBackgroundColor, mainTextColor } from '../../oscarMuiTheme';

import ProgressIndicator from '../../components/ProgressIndicator';
import EmptyChartMessage from '../EmptyChartMessage';

const Plot = createPlotlyComponent(Plotly);

const TablePlot = ({ title, annotations, data }) => {
  if (!data) {
    return <ProgressIndicator />;
  }
  if (!data.cells) {
    return <EmptyChartMessage title="No data available" />;
  }

  const getDataForTablePlot = () => {
    const plotData = [
      {
        type: 'table',
        header: {
          values: data.header.values.map((value) => {
            return [`<b>${value}</b>`];
          }),
          align: data.header.align || 'center',
          line: data.header.line || { width: 1, color: 'rgb(250, 250, 250)' },
          fill: data.header.fill || { color: mainBackgroundColor },
          font: data.header.font || { family: 'sans-serif', size: 14, color: 'rgba(248, 248, 248, 0.52)' },
        },
        cells: {
          values: data.cells.values,
          align: data.cells.align || 'center',
          line: data.cells.line || { color: 'rgba(250, 250, 250, 0.5)', width: 1 },
          fill: data.cells.fill || { color: mainBackgroundColor },
          font: data.cells.font || { family: 'Arial', size: 13, color: 'rgb(248, 248, 248)' },
        },
      },
    ];
    return plotData;
  };

  return (
    <Plot
      data={getDataForTablePlot()}
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
        hovermode: 'closest',
        annotations: [
          {
            xref: 'paper',
            yref: 'paper',
            x: 0,
            y: -0.1,
            xanchor: 'left',
            yanchor: 'top',
            text: annotations[0].text,
            showarrow: false,
            align: 'left',
            font: {
              color: mainTextColor,
              size: 12,
            },
          },
        ],
        modebar: {
          color: mainTextColor,
        },
      }}
      config={{ displayModeBar: 'True' }}
      style={{ width: '100%', height: '530px' }}
      useResizeHandler
    />
  );
};

TablePlot.defaultProps = {
  data: [],
  annotations: [
    {
      text: '',
    },
  ],
};

TablePlot.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({}),
  annotations: PropTypes.arrayOf(PropTypes.any),
};

export default TablePlot;
