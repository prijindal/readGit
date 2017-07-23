import { gql } from 'react-apollo';
const searchResultsFragment = gql`
  fragment searchResultsFragment on SearchResultItemConnection {
    edges {
      node {
        ...on Repository {
          name
          owner {
            login
          }
        }
        ...on User {
          login
          name
          avatarUrl(size: 48)
        }
      }
    }
  }
`

export default searchResultsFragment;
