// @flow
import React, { PureComponent } from 'react';

import SearchResultTab from './SearchResultTab';
import Repository from '../../components/Repository';

const UserSearchResults = ({ screenProps }) => (
  <SearchResultTab
    query={screenProps.searchText}
    type="REPOSITORY"
    renderItem={({item}) => <Repository dispatch={screenProps.dispatch} repository={item.node}/>}
  />
)

export default UserSearchResults;
