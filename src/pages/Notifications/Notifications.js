// @flow
import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';

import {
  textDarkSecondary, textPrimary, textSecondary, textDivider, primary,
  accent, tabBarOptions
} from '../../colors';

import NotificationsTab from './NotificationsTab';
import Header from './Header';

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
  tabBarOptions,
  lazy: false,
  swipeEnabled: true,
  animationEnabled: true,
})

class Notifications extends Component {
  static navigationOptions = {
    header: (props) => (
      <Header dispatch={props.navigation.dispatch}/>
    )
  }

  render() {
    return (
      <NotificationsApp />
    )
  }
}

export default Notifications;
