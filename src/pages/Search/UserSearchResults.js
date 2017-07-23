// @flow
import React, { PureComponent } from 'react';
import { gql, graphql } from 'react-apollo';

import { View, FlatList } from 'react-native';

import ListItem from '../../components/ListItem';
import CenterText from './CenterText';
import Loading from '../../components/Loading';
import searchResultsFragment from './searchResultsFragment';

const User = ({user}) => (
  <ListItem
    item={{
      title: user.login,
      body: user.name,
      image: user.avatarUrl
    }}
    disabled
  />
)

class UserSearchResults extends PureComponent {
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
                renderItem={({item}) => <User user={item.node}/>}
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
    search(first: 10, query: $query, after: $after, type: USER) {
      ...searchResultsFragment
    }
  }
  ${searchResultsFragment}
`

UserSearchResults = graphql(
  SearchQuery,
  {
    options: ({ screenProps: { searchText } }) => ({
      variables: {
        query: searchText,
        after: null
      }
    })
  }
)(UserSearchResults)

export default UserSearchResults;
