// @flow
import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator, NavigationActions } from 'react-navigation';

import {
  textDarkSecondary, textPrimary, textSecondary, textDivider, primary,
  accent, tabBarOptions
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
  tabBarOptions,
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
            })
          }
        },{
          text: 'Repository',
          onPress: () => {
            this.setState({
              grouprepo: true,
            })
          }
        }]
      )
    } else if (pos === 1) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Search' }),);
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
        },{
          title: 'Search',
          show: 'always',
          iconName: 'search'
        }]}
        onActionSelected={this.onActionSelected}
        toolbarSubtitle={this.state.unread ? 'Unread' : 'All'}
      />
    )
  }
}

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
