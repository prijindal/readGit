// @flow
import SideBar from './SideBar';
import { graphql, gql } from 'react-apollo';
import { connect } from 'react-redux';

import { logoutUser } from '../../actions/user';
import { closeDrawer } from '../../actions/drawer';

const UserQuery = gql`
  query {
    viewer {
      id
      login
      name
      email
      avatarUrl
    }
  }
`

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    logout: () => dispatch(logoutUser()),
    closeDrawer: () => dispatch(closeDrawer()),
  })
)(
  graphql(
    UserQuery
  )(SideBar)
);
