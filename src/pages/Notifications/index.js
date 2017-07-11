// @flow
import { connect } from 'react-redux';
import Notifications from './Notifications';

export default connect(
  ({ user }) => ({ user })
)(Notifications);
