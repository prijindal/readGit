// @flow
import React, { PureComponent } from 'react';
import { TabNavigator } from 'react-navigation';

import { tabBarOptions } from '../../colors';

import RepoSearchResults from './RepoSearchResults';
import UserSearchResults from './UserSearchResults';

const SearchResultsTabs = TabNavigator(
  {
    Repository: {
      screen: RepoSearchResults,
    },
    User: {
      screen: UserSearchResults,
    },
  },
  {
    tabBarOptions,
    lazy: false,
    swipeEnabled: true,
    animationEnabled: true,
  }
);

class SearchResults extends PureComponent {
  render() {
    return <SearchResultsTabs screenProps={this.props} />;
  }
}

export default SearchResults;
