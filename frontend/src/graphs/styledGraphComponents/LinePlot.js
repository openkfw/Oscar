import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {
  mainBackgroundColor,
  mainTextColor,
  dashboardChartAxisColor,
  dashboardChartGridColor,
} from '../../oscarMuiTheme';

import ProgressIndicator from '../../components/ProgressIndicator';
import EmptyChartMessage from '../EmptyChartMessage';

const Plot = createPlotlyComponent(Plotly);

const LinePlot = ({
  data,
  title,
  mode,
  xAxisTitle,
  yAxisTitle,
  xAxisField,
  yAxisField,
  lineNameField,
  noDataMessage,
  type,
  colors,
  style,
  layout,
  textPosition,
  hoverTemplate,
  textField,
  stackGroup,
  config,
}) => {
  if (!data) {
    return <ProgressIndicator />;
  }
  if (data.length === 0) {
    return <EmptyChartMessage title={noDataMessage} />;
  }

  const getDataForLinePlot = () => {
    const items = [...data];

    let colorCounter = 0;

    const plotData = items.map((item, idx) => {
      colorCounter += 5;
      return {
        type,
        mode,
        text: item[textField],
        name: item[lineNameField],
        x: item[xAxisField],
        y: item[yAxisField],
        line: colors ? colors[idx] : { color: `rgba(200,${colorCounter},0,0.5)` },
        marker: {
          color: colors ? colors[idx] : { color: `rgba(200,${colorCounter},0,0.5)` },
        },
        textposition: textPosition,
        hovertemplate: hoverTemplate,
        stackgroup: stackGroup,
      };
    });
    return plotData;
  };

  return (
    <Plot
      data={getDataForLinePlot()}
      layout={
        layout || {
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
            title: xAxisTitle,
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
          modebar: {
            color: mainTextColor,
          },
          showlegend: true,
          legend: { orientation: 'h', font: { color: mainTextColor }, x: 0, y: -0.3 },
        }
      }
      config={config}
      style={style}
      useResizeHandler
    />
  );
};

LinePlot.defaultProps = {
  data: null,
  title: '',
  mode: null,
  type: null,
  xAxisTitle: null,
  yAxisTitle: null,
  lineNameField: null,
  noDataMessage: 'No data available',
  colors: null,
  style: {
    width: '100%',
    height: '100%',
  },
  layout: null,
  textPosition: null,
  hoverTemplate: null,
  textField: null,
  stackGroup: null,
  config: null,
};

LinePlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  xAxisField: PropTypes.string.isRequired,
  yAxisField: PropTypes.string.isRequired,
  lineNameField: PropTypes.string,
  mode: PropTypes.string,
  title: PropTypes.string,
  noDataMessage: PropTypes.string,
  type: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.shape({}),
  layout: PropTypes.shape({}),
  textPosition: PropTypes.string,
  hoverTemplate: PropTypes.string,
  textField: PropTypes.string,
  stackGroup: PropTypes.string,
  config: PropTypes.shape({}),
};

export default memo(LinePlot);
