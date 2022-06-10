import React, { memo } from 'react';
import Plotly from 'plotly.js-dist';
import PropTypes from 'prop-types';

import createPlotlyComponent from 'react-plotly.js/factory';
import {
  mainBackgroundColor,
  mainTextColor,
  dashboardChartAxisColor,
  dashboardChartGridColor,
} from '../../utils/oscarMuiTheme';

import ProgressIndicator from '../ProgressIndicator';
import EmptyChartMessage from '../EmptyChartMessage';

const Plot = createPlotlyComponent(Plotly);

const BarPlot = ({ id, title, xAxisTitle, yAxisTitle, xAxisField, yAxisField, noDataMessage, style, config }) => {
  if (!xAxisField) {
    return <ProgressIndicator />;
  }
  if (xAxisField.length === 0) {
    return <EmptyChartMessage title={noDataMessage} />;
  }
  return (
    <Plot
      divId={id}
      data={[{ type: 'bar', x: xAxisField, y: yAxisField }]}
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
        xaxis: {
          type: 'category',
          title: xAxisTitle,
          titlefont: {
            color: mainTextColor,
            size: 14,
          },
          tickfont: {
            color: dashboardChartAxisColor,
            size: 12,
          },
        },
        yaxis: {
          title: yAxisTitle,
          titlefont: {
            color: mainTextColor,
            size: 14,
          },
          tickfont: {
            color: dashboardChartAxisColor,
            size: 12,
          },
          gridcolor: dashboardChartGridColor,
        },
      }}
      useResizeHandler
      config={config}
      style={style}
    />
  );
};

BarPlot.defaultProps = {
  title: '',
  xAxisTitle: null,
  yAxisTitle: null,
  xAxisField: null,
  yAxisField: null,

  noDataMessage: 'No data available',
  style: {
    width: '100%',
    height: '100%',
  },
  config: { displayModeBar: 'True' },
};

BarPlot.propTypes = {
  id: PropTypes.string.isRequired,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  xAxisField: PropTypes.arrayOf(PropTypes.string),
  yAxisField: PropTypes.arrayOf(PropTypes.number),
  title: PropTypes.string,
  noDataMessage: PropTypes.string,
  style: PropTypes.shape({}),
  config: PropTypes.shape({}),
};

export default memo(BarPlot);
