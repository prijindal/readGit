// @flow
import React from 'react';

import { View, FlatList } from 'react-native';

import ListItem from '../../components/ListItem';
import CenterText from './CenterText';


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

export default UserSearchResults;
