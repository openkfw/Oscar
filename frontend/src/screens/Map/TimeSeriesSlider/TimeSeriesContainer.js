import React, { useState, useEffect } from 'react';
import { getAvailableDates } from '../../../axiosRequests';
import TimeSeriesSlider from './TimeSeriesSlider';

const TimeSeriesContainer = ({ layer, updateLayerFnc }) => {
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const getAD = async () => {
      if (layer) {
        const ad = await getAvailableDates(layer.get('attribute'));
        if (ad && ad.length) {
          setAvailableDates(ad);
        } else {
          setAvailableDates([]);
        }
      } else {
        setAvailableDates([]);
      }
    };
    getAD();
  }, [layer]);

  if (availableDates.length > 0) {
    return <TimeSeriesSlider availableDates={availableDates} modifiedLayer={layer} updateLayerFnc={updateLayerFnc} />;
  }
  return null;
};

export default TimeSeriesContainer;
