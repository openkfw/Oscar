import { connect } from 'react-redux';
import { setIsMobile } from './actions';
import DeviceDetection from './DeviceDetection';

const mapStateToProps = (state) => ({ isMobile: state.get('isMobile') });

const mapDispatchToProps = { setIsMobile };

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetection);
