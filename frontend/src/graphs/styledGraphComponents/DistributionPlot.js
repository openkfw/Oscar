import React, { memo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';

import createPlotlyComponent from 'react-plotly.js/factory';

import {
  mainTextColor,
  dashboardChartAxisColor,
  dashboardChartGridColor,
  mainBackgroundColor,
} from '../../utils/oscarMuiTheme';
import EmptyChartMessage from '../EmptyChartMessage';
import ProgressIndicator from '../ProgressIndicator';

const Plot = createPlotlyComponent(Plotly);

const DistributionPlot = ({
  id,
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  y2AxisTitle,
  xAxisField,
  yAxisField,
  onBarClick,
  emptyChartMessage,
  hidden,
  barmode,
  layout,
  noData,
  onHoverCursor,
}) => {
  const [selectedProvince, setSelectedProvince] = useState({});

  const el = useRef(null);

  if (!data) {
    return <ProgressIndicator />;
  }
  if (hidden) {
    return <EmptyChartMessage title={emptyChartMessage} />;
  }
  if (data.length === 0 && noData) {
    return <EmptyChartMessage title="No data available" />;
  }
  if (data.length === 0) {
    return <EmptyChartMessage title={emptyChartMessage} />;
  }

  const getPlotData = () => {
    const plotData = [];
    data.forEach((category) => {
      if (category.data.length === 0) {
        return;
      }
      const barData = {
        type: category.type,
        name: category.name,
        x: [],
        y: [],
        xaxis: category.xaxis,
        yaxis: category.yaxis,
        hoverinfo: category.hoverinfo,
        orientation: category.orientation,
        marker: {
          color: category.marker ? category.marker.color : 'darkgreen',
        },
        line: {
          color: category.line ? category.line.color : 'darkgreen',
        },
        text: [],
      };
      category.data.map((item) => {
        if (item._text) {
          barData.text.push(item._text);
        }
        barData.x.push(item[xAxisField]);
        return barData.y.push(item[yAxisField]);
      });
      plotData.push(barData);
    });
    return plotData;
  };

  const plotData = getPlotData();

  const selectBar = (e) => {
    if (!e || !e.points || !e.points.length) {
      return;
    }
    const { x, y } = e.points[0];
    if (selectedProvince && (x === selectedProvince.x || y === selectedProvince.y)) {
      setSelectedProvince({});
      onBarClick({});
    } else {
      setSelectedProvince({ x, y });
      onBarClick({ x, y });
    }
  };

  const getCursorStyle = () => {
    el.current.el.getElementsByClassName('nsewdrag')[0].style.cursor = onHoverCursor;
  };

  return (
    <Plot
      ref={el}
      divId={id}
      data={plotData}
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
          barmode,
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
          yaxis2: {
            title: y2AxisTitle,
            side: 'right',
            overlaying: 'y',
            anchor: 'y3',
            range: [0, 10],
            showgrid: false,
          },
          modebar: {
            color: mainTextColor,
          },
          legend: { orientation: 'h', font: { color: mainTextColor, size: 12 }, x: 0, y: -0.3 },
        }
      }
      config={{ displayModeBar: 'True' }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
      onClick={(e) => selectBar(e)}
      onHover={() => getCursorStyle()}
    />
  );
};

DistributionPlot.defaultProps = {
  data: [],
  onBarClick: () => {},
  emptyChartMessage: '',
  hidden: false,
  xAxisTitle: '',
  yAxisTitle: '',
  y2AxisTitle: '',
  barmode: null,
  layout: null,
  title: '',
  noData: false,
  onHoverCursor: 'pointer',
};

DistributionPlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  y2AxisTitle: PropTypes.string,
  xAxisField: PropTypes.string.isRequired,
  yAxisField: PropTypes.string.isRequired,
  onBarClick: PropTypes.func,
  emptyChartMessage: PropTypes.string,
  hidden: PropTypes.bool,
  barmode: PropTypes.string,
  layout: PropTypes.shape({}),
  noData: PropTypes.bool,
  onHoverCursor: PropTypes.string,
};

export default memo(DistributionPlot);
