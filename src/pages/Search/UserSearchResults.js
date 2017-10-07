// @flow
import React from 'react';

import SearchResultTab from './SearchResultTab';
import User from '../../components/User';

const UserSearchResults = ({ screenProps }) => (
  <SearchResultTab
    query={screenProps.searchText}
    dispatch={screenProps.dispatch}
    type="USER"
    renderItem={({ item }) => <User dispatch={screenProps.dispatch} user={item.node} />}
  />
);

export default UserSearchResults;
