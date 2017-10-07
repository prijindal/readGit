// @flow
import { gql, graphql } from 'react-apollo';
import Overview from './Overview';
import PinnedRepositories from './PinnedRepositories';

const userQuery = gql`
  query($login: String!) {
    repositoryOwner(login: $login){
      avatarUrl
      login
      pinnedRepositories(first: 5) {
        ...pinnedRepositoriesFragment
      }
      ...on Organization {
        name
      }
      ...on User {
        name
        location
        email
        websiteUrl
        bio
      }
    }
  }
  ${PinnedRepositories.fragment}
`;

export default graphql(userQuery, {
  options: ({ screenProps }) => ({
    variables: {
      login: screenProps.navigation.state.params.user.login,
    },
  }),
})(Overview);
