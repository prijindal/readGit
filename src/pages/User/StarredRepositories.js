// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';
import RepositoriesList from './RepositoriesList';

class StarredRepositories extends PureComponent {
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
      starredRepositories(first: 10) {
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
)(StarredRepositories);
