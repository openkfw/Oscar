import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {
  mainBackgroundColor,
  mainTextColor,
  dashboardChartAxisColor,
  dashboardChartGridColor,
} from '../../muiTheme/colors';

import ProgressIndicator from '../ProgressIndicator';
import EmptyChartMessage from '../EmptyChartMessage';

const Plot = createPlotlyComponent(Plotly);

const LinePlot = ({
  id,
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
      let line;
      let marker = {};
      if (colors) {
        line = colors[idx];
        marker = {
          color: colors[idx],
        };
      } else if (item.color) {
        line = item.dash ? { color: item.color, dash: item.dash } : item.color;
        marker = item.dash
          ? {
              color: item.color,
              dash: item.dash,
            }
          : {
              color: item.color,
            };
      } else {
        line = { color: `rgba(200,${colorCounter},0,0.5)` };
        marker = { color: `rgba(200,${colorCounter},0,0.5)` };
      }
      return {
        type,
        mode,
        text: item[textField],
        name: item[lineNameField],
        x: item[xAxisField],
        y: item[yAxisField],
        line,
        marker,
        textposition: textPosition,
        hovertemplate: hoverTemplate,
        stackgroup: stackGroup,
      };
    });
    return plotData;
  };

  return (
    <Plot
      divId={id}
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
            dtick: 'M12',
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
  id: PropTypes.string.isRequired,
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
