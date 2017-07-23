import { gql } from 'react-apollo';
import Repository from '../../components/Repository';

const searchResultsFragment = gql`
  fragment searchResultsFragment on SearchResultItemConnection {
    edges {
      node {
        ...on Repository {
          ...repositoryFragment
        }
        ...on User {
          login
          name
          avatarUrl(size: 48)
        }
      }
    }
  }
  ${Repository.fragment}
`

export default searchResultsFragment;
