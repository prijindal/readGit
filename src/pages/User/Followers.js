// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';
import UsersList from './UsersList';
import User from '../../components/User'

class Followers extends PureComponent {
  render() {
    return (
      <UsersList
        navigation={this.props.screenProps.navigation}
        data={this.props.data}
      />
    )
  }
}

const userQuery = gql`
  query($login: String!) {
    repositoryOwner(login: $login){
      ...on User {
        users: followers(first: 10) {
          edges {
            node {
              ...userFragment
            }
          }
        }
      }
    }
  }
  ${User.fragment}
`

export default graphql(
  userQuery,
  {
    options: ({ screenProps }) => ({
      variables: {
        login: screenProps.navigation.state.params.user.login
      }
    })
  }
)(Followers);
