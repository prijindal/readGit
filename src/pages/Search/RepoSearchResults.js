// @flow
import React from 'react';

import { View, FlatList } from 'react-native';

import ListItem from '../../components/ListItem';
import CenterText from './CenterText';

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

export default RepoSearchResults;
