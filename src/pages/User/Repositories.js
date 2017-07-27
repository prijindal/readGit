// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';
import RepositoriesList from './RepositoriesList';

class Repositories extends PureComponent {
  render() {
    return (
      <RepositoriesList
        data={this.props.data}
      />
    )
  }
}

const userQuery = gql`
  query($login: String!) {
    repositoryOwner(login: $login){
      repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}) {
        ...repositoriesListFragment
      }
    }
  }
  ${RepositoriesList.fragment}
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
)(Repositories);
