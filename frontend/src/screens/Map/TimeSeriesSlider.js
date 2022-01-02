import React, { useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { accentColor, mainBackgroundColor } from '../../oscarMuiTheme';
import { debounce } from '../../helpers';

const TimeSlider = withStyles((theme) => ({
  root: {
    top: '90vh',
    left: '30%',
    position: 'absolute',
    maxWidth: '40%',
    '& span[data-index]:nth-last-child(3)': {
      width: 0,
    },
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: accentColor.main,
    border: `2px solid ${mainBackgroundColor}`,
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &:active': {
      boxShadow: 'inherit',
    },
  },
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    backgroundColor: mainBackgroundColor,
  },
  rail: {
    height: 8,
    backgroundColor: mainBackgroundColor,
    opacity: 1,
  },
  mark: {
    backgroundColor: theme.palette.primary.main,
  },
  markLabel: {
    color: theme.palette.primary.main,
  },
}))(Slider);

const TimesliderTooltip = withStyles({
  tooltip: {
    backgroundColor: 'rgba(75, 75, 88, 0.95)',
    filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))',
    padding: 10,
    borderRadius: 10,
    border: '1px solid #cccccc',
    color: 'rgb(200, 200, 200)',
    fontSize: 14,
  },
})(Tooltip);

const ValueLabelComponent = (props) => {
  const { children, open, value } = props;

  return (
    <TimesliderTooltip open={open} enterTouchDelay={0} placement="top" title={value} arrow>
      {children}
    </TimesliderTooltip>
  );
};

const changeModifiedLayerSource = (value, modifiedLayer) => {
  if (modifiedLayer) {
    modifiedLayer.getSource().set('sliderDate', new Date(value).toISOString());
    modifiedLayer.getSource().refresh();
  }
};

const debounceSourceChange = debounce(changeModifiedLayerSource, 200);

const TimeSeriesSlider = ({ availableDates, modifiedLayer }) => {
  const marks = [];
  const labels = [];
  let dataDate;

  for (let i = 0; i < availableDates.length; i++) {
    dataDate = availableDates[i].dataDate;
    if (i === 0 || i === availableDates.length - 1) {
      if (dataDate) {
        marks.push({
          value: new Date(availableDates[i].date).getTime(),
          label: availableDates[i].dataDate,
        });
        labels.push({
          label: availableDates[i].dataDate,
        });
      } else {
        marks.push({
          value: new Date(availableDates[i].date).getTime(),
          label: availableDates[i].date.split('T')[0],
        });
        labels.push({
          label: availableDates[i].date.split('T')[0],
        });
      }
    } else if (dataDate) {
      marks.push({
        value: new Date(availableDates[i].date).getTime(),
      });
      labels.push({
        label: availableDates[i].dataDate,
      });
    } else {
      marks.push({
        value: new Date(availableDates[i].date).getTime(),
      });
      labels.push({
        label: availableDates[i].date.split('T')[0],
      });
    }
  }

  const minValue = marks[0].value;
  const maxValue = marks[marks.length - 1].value;

  const [currentValue, setCurrentValue] = useState(undefined);

  useEffect(() => {
    setCurrentValue(undefined);
  }, [modifiedLayer]);

  const valueLabelFormat = (value) => {
    if (!currentValue) {
      return 'LAST'; // first load with no value set in slider
    }
    if (!value) {
      return 'LAST';
    }
    const currentMarkIndex = marks.findIndex((mark) => mark.value === value);
    return labels[currentMarkIndex].label;
  };

  return (
    <>
      <TimeSlider
        valueLabelFormat={valueLabelFormat}
        aria-labelledby="discrete-slider-restrict"
        step={null}
        valueLabelDisplay="on"
        ValueLabelComponent={ValueLabelComponent}
        marks={marks}
        value={currentValue || maxValue}
        min={minValue}
        max={maxValue}
        onChange={(_, value) => (value !== currentValue ? setCurrentValue(value) : null)}
        onChangeCommitted={() => debounceSourceChange(currentValue, modifiedLayer, availableDates, dataDate)}
      />
    </>
  );
};

export default TimeSeriesSlider;
