// @flow
import { connect } from 'react-redux';
import NotificationsTab from './NotificationsTab';

export default connect(
  ({ user, settings }) => ({ token: user.token, grouprepo: settings.grouprepo })
)(NotificationsTab);
