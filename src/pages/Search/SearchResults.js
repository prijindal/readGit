// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { TabNavigator } from 'react-navigation';
import { View, Text, FlatList } from 'react-native';

import { tabBarOptions } from '../../colors';

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
    return (
      <SearchResultsTabs
        screenProps={this.props}
      />
    );
  }
}

export default SearchResults;
