// @flow
import React, { PureComponent } from 'react';

import SearchResultTab from './SearchResultTab';
import User from '../../components/User';

const UserSearchResults = ({ screenProps }) => (
  <SearchResultTab
    query={screenProps.searchText}
    type="USER"
    renderItem={({item}) => <User user={item.node}/>}
  />
)

export default UserSearchResults;
