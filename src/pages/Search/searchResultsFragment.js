import { gql } from 'react-apollo';
import Repository from '../../components/Repository';
import User from '../../components/User';

const searchResultsFragment = gql`
  fragment searchResultsFragment on SearchResultItemConnection {
    edges {
      cursor
      node {
        ...on Repository {
          ...repositoryFragment
        }
        ...on RepositoryOwner{
          login
          avatarUrl
          url
        }
        ...on User {
          name
        }
        ...on Organization {
          name
        }
      }
    }
  }
  ${Repository.fragment}
`

export default searchResultsFragment;
