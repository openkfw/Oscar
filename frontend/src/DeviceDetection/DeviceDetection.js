import React from 'react';
import PropTypes from 'prop-types';

const mobileResolution = 415;

class DeviceDetection extends React.Component {
  constructor(props) {
    super(props);
    window.addEventListener('resize', this.checkResolution);
  }

  componentDidMount() {
    this.checkResolution();
  }

  checkResolution = () => {
    const { isMobile, setIsMobile } = this.props;

    if (window.innerWidth <= mobileResolution && !isMobile) {
      setIsMobile(true);
    }
    if (window.innerWidth > mobileResolution && isMobile) {
      setIsMobile(false);
    }
  };

  render() {
    return null;
  }
}

DeviceDetection.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  setIsMobile: PropTypes.func.isRequired,
};

export default DeviceDetection;
