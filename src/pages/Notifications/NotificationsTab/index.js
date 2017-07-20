// @flow
import { connect } from 'react-redux';
import NotificationsTab from './NotificationsTab';

export default connect(
  ({ user }) => ({ token: user.token })
)(NotificationsTab);
