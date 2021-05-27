import { connect } from 'react-redux';
import PointInfo from './PointInfo';
import { actions as infoActions } from './actions';

const mapStateToProps = (state) => ({
  numberOfFeatures: state.getIn(['pixelDetails', 'descriptions'])
    ? state.getIn(['pixelDetails', 'descriptions']).toJSON().length
    : 0,
  pixel: state.getIn(['pixelDetails', 'pixel']) || [],
  coordinates: state.getIn(['pixelDetails', 'coordinates']),
  descriptions: state.getIn(['pixelDetails', 'descriptions']),
});

const mapDispatchToProps = {
  setPixel: infoActions.setPixelDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(PointInfo);
