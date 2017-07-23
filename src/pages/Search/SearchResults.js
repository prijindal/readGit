// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { TabNavigator } from 'react-navigation';
import { View, Text, FlatList } from 'react-native';

import { tabBarOptions } from '../../colors';

import Loading from '../../components/Loading';
import ListItem from '../../components/ListItem';

import SearchInput from './SearchInput';


const CenterText = styled.Text`
  margin-vertical: 20;
  text-align: center;
`

const User = ({user}) => (
  <ListItem
    item={{
      title: user.name,
      body: user.name,
      image: 'https://avatars3.githubusercontent.com/u/49185?v=4&s=96'
    }}
    disabled
  />
)

const UserSearchResults = ({ screenProps: { loading, results }  }) => (
  <View>
    {results.data.userresults.edges.length === 0 ?
      <CenterText>No Results Found</CenterText> :
      <FlatList
        data={results.data.userresults.edges}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => <User user={item.node}/>}
      />
    }
  </View>
)

const Repository = ({repository}) => (
  <ListItem
    item={{
      title: `${repository.owner.login}/${repository.name}`
    }}
    disabled
  />
)

const RepoSearchResults = ({ screenProps: { loading, results }  }) => (
  <View>
    {results.data.reporesults.edges.length === 0 ?
      <CenterText>No Results Found</CenterText> :
      <FlatList
        data={results.data.reporesults.edges}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => <Repository repository={item.node}/>}
      />
    }
  </View>
)

const SearchResultsTabs = TabNavigator({
  Repository: {
    screen: RepoSearchResults,
  },
  User: {
    screen: UserSearchResults
  }
}, {
  tabBarOptions,
  lazy: false,
  swipeEnabled: true,
  animationEnabled: true,
})

class SearchResults extends PureComponent {

  render() {
    if(this.props.loading) {
      return <Loading />
    }
    if (!this.props.results || !this.props.results.data) {
      return <CenterText>Please Enter a search result</CenterText>
    }
    return (
      <SearchResultsTabs
        screenProps={this.props}
      />
    );
  }
}

export default SearchResults;
