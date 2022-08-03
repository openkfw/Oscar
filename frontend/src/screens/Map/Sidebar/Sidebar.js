/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';

import { SELECT_LAYERS, MENU_OPENED } from '../../../constants/currentActivity';
import SideMenu from '../../../components/layout/SideMenu';
import SelectBar from './Selectbar';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    props.map.on('click', () => {
      this.props.closeSidebar();
    });
  }

  render() {
    switch (this.props.currentActivity) {
      case SELECT_LAYERS:
        return (
          <SelectBar
            isLoading={this.props.isLoading}
            mapLayers={this.props.mapLayers}
            layers={this.props.layers}
            staticLayersData={this.props.staticLayersData}
            toggleStaticLayer={this.props.toggleStaticLayer}
            selectLayer={(title) => this.props.selectLayers(title)}
            switchMapLayers={this.props.switchMapLayers}
            handleClose={this.props.closeSidebar}
          />
        );
      case MENU_OPENED:
        return <SideMenu />;
      default:
        return null;
    }
  }
}

Sidebar.propTypes = {
  mapLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  layers: PropTypes.arrayOf(PropTypes.object).isRequired,
  staticLayersData: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeSidebar: PropTypes.func.isRequired,
  currentActivity: PropTypes.string.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleStaticLayer: PropTypes.func.isRequired,
  switchMapLayers: PropTypes.func.isRequired,
  selectLayers: PropTypes.func,
  isLoading: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Sidebar;
