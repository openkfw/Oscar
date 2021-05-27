import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { mainBackgroundColor } from '../../../oscarMuiTheme';
import logo from '../../../data/logo_orange.png';
import GeolocationButton from './GeolocationButton';
import LayerButton from './LayersButton';
import BasemapsButton from './BasemapsButton';

import BurgerButton from './BurgerButton';

export const ActionButtons = ({ isMobile, map, mapLayers, switchMapLayers }) => {
  const desktopStyle = {
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '330px',
    height: '64px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    background: `${mainBackgroundColor} url(${logo}) no-repeat 20px center`,
    paddingRight: '6px',
  };

  return (
    <div style={isMobile ? {} : desktopStyle}>
      {!isMobile ? <BurgerButton isMobile={isMobile} /> : null}
      <GeolocationButton isMobile={isMobile} />
      <BasemapsButton map={map} mapLayers={mapLayers} switchMapLayers={switchMapLayers} />
      <LayerButton isMobile={isMobile} />
    </div>
  );
};

ActionButtons.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  mapLayers: PropTypes.arrayOf(PropTypes.any).isRequired,
  switchMapLayers: PropTypes.func.isRequired,
};

export default connect((state) => ({ isMobile: state.get('isMobile') }), null)(ActionButtons);
