// @flow
import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';

import {
  textDarkSecondary, textPrimary, textSecondary, textDivider, primary,
  accent
} from '../../colors';

import Layout from '../../components/Layout';

import NotificationsTab from './NotificationsTab';

const Unread = () => (
  <NotificationsTab
    unread={true}
  />
)

const All = () => (
  <NotificationsTab
    unread={false}
  />
)

const Participating = () => (
  <NotificationsTab
    unread={false}
    participating={true}
  />
)

const NotificationsApp = TabNavigator({
  Unread: {
    screen: Unread,
  },
  All: {
    screen: All,
  },
  Participating: {
    screen: Participating,
  },
}, {
  tabBarOptions: {
    activeTintColor: textPrimary,
    inactiveTintColor: textSecondary,
    scrollEnabled: false,
    labelStyle: {
      fontSize: 14,
      color: textPrimary
    },
    tabStyle: {
      height: 48,
    },
    style: {
      backgroundColor: primary
    },
    indicatorStyle: {
      backgroundColor: accent,
      height: 2
    }
  },
  lazy: false,
  swipeEnabled: true,
  animationEnabled: true,
})

class Header extends Component {

  state = {
    grouprepo: false, // TODO: User settings
  }

  onActionSelected = (pos) => {
    if (pos === 0) {
      Alert.alert(
        'Group by',
        undefined,
        [{
          text: 'Date',
          onPress: () => {
            this.setState({
              grouprepo: false,
            }, this.initData)
          }
        },{
          text: 'Repository',
          onPress: () => {
            this.setState({
              grouprepo: true,
            }, this.initData)
          }
        }]
      )
    }
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="Notifications"
        actions={[{
          title: 'Group by',
          show: 'always',
          iconName: 'filter-list'
        }]}
        onActionSelected={this.onActionSelected}
        toolbarSubtitle={this.state.unread ? 'Unread' : 'All'}
      />
    )
  }
}

class Notifications extends Component {
  static navigationOptions = {
    header: () => (
      <Header />
    )
  }

  render() {
    return (
      <NotificationsApp />
    )
  }
}

export default Notifications;
