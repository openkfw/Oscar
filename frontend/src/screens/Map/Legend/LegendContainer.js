import React from 'react';
import { connect } from 'react-redux';
import MobileLegendLayout from './MobileLegendLayout';
import LegendLayout from './LegendLayout';

const LegendContainer = ({ isMobile, ...props }) => {
  if (isMobile) {
    return <MobileLegendLayout {...props} />;
  }
  return <LegendLayout {...props} />;
};

const mapStateToProps = (state) => ({
  isMobile: state.get('isMobile'),
});

export default connect(mapStateToProps)(LegendContainer);
