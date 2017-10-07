// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';

import { FlatList } from 'react-native';

import CenterText from './CenterText';
import Loading from '../../components/Loading';
import searchResultsFragment from './searchResultsFragment';

class SearchResultTab extends PureComponent {
  render() {
    const { data, renderItem } = this.props;
    if (data.loading) {
      return <Loading />;
    }
    if (data.error) {
      return <CenterText>{data.error.message}</CenterText>;
    }
    if (!data.search || !data.search.edges || data.search.edges.length === 0) {
      return <CenterText>No Results Found</CenterText>;
    }
    return (
      <FlatList
        data={data.search.edges}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        refreshing={data.loading}
        onRefresh={this.props.data.refetch}
      />
    );
  }
}

const SearchQuery = gql`
  query($query: String!, $after: String, $type: SearchType!) {
    search(first: 10, query: $query, after: $after, type: $type) {
      ...searchResultsFragment
    }
  }
  ${searchResultsFragment}
`;

SearchResultTab = graphql(SearchQuery, {
  options: ({ query, type }) => ({
    variables: {
      query,
      after: null,
      type,
    },
  }),
})(SearchResultTab);

export default SearchResultTab;
