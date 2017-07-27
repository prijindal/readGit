// @flow
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { TabNavigator } from 'react-navigation';

import {
  tabBarOptions
} from '../../colors';
import Layout from '../../components/Layout';
import Overview from './Overview';
import Repositories from './Repositories';
import StarredRepositories from './StarredRepositories';
import Followers from './Followers';

const paramsToState = (props) => {
  const { state } = props.navigation;
  console.log(state);
  if (state.routes[state.index].params) {
    return state.routes[state.index].params.user;
  } else {
    return {};
  }
}

class Header extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }

  state = {
    user: paramsToState(this.props),
  }

  render() {
    const { user } = this.state;
    return (
      <Layout
        backButton
        onBackButtonPress={() => this.props.navigation.goBack()}
        toolbarTitle={user.login}
        toolbarSubtitle={user.name}
      />
    )
  }
}

const UserTabs = TabNavigator({
  Overview: {
    screen: Overview
  },
  Repositories: {
    screen: Repositories
  },
  Starred: {
    screen: StarredRepositories
  },
  Followers: {
    screen: Followers
  }
}, {
  tabBarOptions: {
    ...tabBarOptions,
    scrollEnabled: true
  },
  lazy: true,
  swipeEnabled: true,
  animationEnabled: true,
})

class User extends Component {
  static navigationOptions = {
    header: (props, extraProps) => (
      <Header {...props}/>
    )
  }

  render() {
    return (
      <UserTabs screenProps={this.props} />
    )
  }
}

export default User;
