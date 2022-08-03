import React, { useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ConfigContext } from '../../contexts';
import PublicMapWrapper from './PublicMap';

const PublicMapContainer = (props) => {
  const configContext = useContext(ConfigContext);
  const { config } = configContext;
  const mapConfig = config.map;
  if (mapConfig) {
    return <PublicMapWrapper {...props} mapConfig={mapConfig} />;
  }
  return null;
};

const mapDispatchToProps = {};

PublicMapWrapper.propTypes = {
  currentActivity: PropTypes.string,
};

export default connect(undefined, mapDispatchToProps)(PublicMapContainer);
