// @flow
import React, { PureComponent } from 'react';
import { NavigationActions } from 'react-navigation';
import { gql } from 'react-apollo';

import ListItem from './ListItem';

class User extends PureComponent {
  onPress = () => {
    const { user } = this.props;
    this.props.dispatch(NavigationActions.navigate({ routeName: 'User', params: { user } }));
  };

  render() {
    const { user } = this.props;
    return (
      <ListItem
        onPress={this.onPress}
        item={{
          title: user.login,
          body: user.name,
          image: user.avatarUrl,
        }}
        disabled
      />
    );
  }
}

User.fragment = gql`
  fragment userFragment on RepositoryOwner {
    id
    login
    avatarUrl
    url
    ... on User {
      name
    }
    ... on Organization {
      name
    }
  }
`;

export default User;
