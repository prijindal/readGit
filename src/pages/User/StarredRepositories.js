// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';
import RepositoriesList from './RepositoriesList';
import Repository from '../../components/Repository';

class StarredRepositories extends PureComponent {
  render() {
    return <RepositoriesList data={this.props.data} />;
  }
}

const userQuery = gql`
  query($login: String!) {
    repositoryOwner(login: $login){
      ...on User {
        repositories: starredRepositories(first: 10, orderBy: {field: STARRED_AT, direction: DESC}) {
          edges {
            node {
              ...repositoryFragment
            }
          }
        }
      }
    }
  }
  ${Repository.fragment}
`;

export default graphql(userQuery, {
  options: ({ screenProps }) => ({
    variables: {
      login: screenProps.navigation.state.params.user.login,
    },
  }),
})(StarredRepositories);
