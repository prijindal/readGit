// @flow
import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import { gql } from 'react-apollo';

import ListItem from './ListItem';

class User extends PureComponent {
  onPress = () => {
    const { user } = this.props;
    Linking.openURL(user.url);
  }
  render() {
    const { user } = this.props;
    return (
      <ListItem
        onPress={this.onPress}
        item={{
          title: user.login,
          body: user.name,
          image: user.avatarUrl
        }}
        disabled
      />
    )
  }
}

export default User;
