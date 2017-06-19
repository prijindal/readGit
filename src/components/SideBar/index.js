// @flow
import SideBar from './SideBar';
import { connect } from 'react-redux';

import { logoutUser } from '../../actions/user';
import { closeDrawer } from '../../actions/drawer';

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    logout: () => dispatch(logoutUser()),
    closeDrawer: () => dispatch(closeDrawer()),
  })
)(SideBar);
