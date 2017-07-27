// @flow
import React, { PureComponent } from 'react';
import { Text, FlatList } from 'react-native';

import Loading from '../../components/Loading';
import User from '../../components/User'

class UsersList extends PureComponent {
  render() {
    const { data } = this.props
    if (data.loading) {
      return <Loading />;
    }
    if (data.error) {
      return <Text>{data.error.message}</Text>;
    }
    if (!data.repositoryOwner || !data.repositoryOwner.users.edges || data.repositoryOwner.users.edges.length === 0) {
      return <Text>No Results Found</Text>;
    }
    return (
      <FlatList
        data={data.repositoryOwner.users.edges}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) =>
          <User user={item.node} dispatch={this.props.navigation.dispatch}/>
        }
      />
    )
  }
}


export default UsersList