// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { TabNavigator } from 'react-navigation';
import { View, Text, FlatList } from 'react-native';

import { tabBarOptions } from '../../colors';

import Loading from '../../components/Loading';
import ListItem from '../../components/ListItem';

import CenterText from './CenterText';
import RepoSearchResults from './RepoSearchResults';
import UserSearchResults from './UserSearchResults';

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
