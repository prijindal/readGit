// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';

import { View, FlatList } from 'react-native';

import CenterText from './CenterText';
import Loading from '../../components/Loading';
import Repository from '../../components/Repository';
import searchResultsFragment from './searchResultsFragment';

class RepoSearchResults extends PureComponent {
  render() {
    const { data } = this.props
    return (
      <View>
        {data.loading ? <Loading/>:
          <View>
            {data.search.edges.length === 0 ?
              <CenterText>No Results Found</CenterText> :
              <FlatList
                data={data.search.edges}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => <Repository repository={item.node}/>}
              />
            }
          </View>
        }
      </View>
    )
  }
}

const SearchQuery = gql`
  query($query: String!, $after: String) {
    search(first: 10, query: $query, after: $after, type: REPOSITORY) {
      ...searchResultsFragment
    }
  }
  ${searchResultsFragment}
`

RepoSearchResults = graphql(
  SearchQuery,
  {
    options: ({ screenProps: { searchText } }) => ({
      variables: {
        query: searchText,
        after: null
      }
    })
  }
)(RepoSearchResults)

export default RepoSearchResults;
