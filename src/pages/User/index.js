// @flow
import { gql, graphql } from 'react-apollo';
import User from './User';
import PinnedRepositories from './PinnedRepositories';

const userQuery = gql`
  query($login: String!) {
    repositoryOwner(login: $login){
      avatarUrl
      login
      pinnedRepositories(first: 5) {
        ...pinnedRepositoriesFragment
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
`

export default graphql(
  userQuery,
  {
    options: ({ navigation }) => ({
      variables: {
        login: navigation.state.params.user.login
      }
    })
  }
)(User);
