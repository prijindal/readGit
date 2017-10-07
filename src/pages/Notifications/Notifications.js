// @flow
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';

import { tabBarOptions } from '../../colors';

import NotificationsTab from './NotificationsTab';
import Header from './Header';

const Unread = () => <NotificationsTab unread />;

const All = () => <NotificationsTab unread={false} />;

const Participating = () => <NotificationsTab unread={false} participating />;

const NotificationsApp = TabNavigator(
  {
    Unread: {
      screen: Unread,
    },
    All: {
      screen: All,
    },
    Participating: {
      screen: Participating,
    },
  },
  {
    tabBarOptions: {
      ...tabBarOptions,
      scrollEnabled: true,
    },
    lazy: false,
    swipeEnabled: true,
    animationEnabled: true,
  }
);

class Notifications extends Component {
  static navigationOptions = {
    header: props => <Header dispatch={props.navigation.dispatch} />,
  };

  render() {
    return <NotificationsApp />;
  }
}

export default Notifications;
