import { connect } from 'react-redux';
import { actions as overviewActions } from '../../../actions';
import Sidebar from './Sidebar';

const mapStateToProps = (state) => ({
  currentActivity: state.getIn(['overview', 'currentActivity']),
});
const mapDispatchToProps = {
  closeSidebar: overviewActions.closeSidebar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
