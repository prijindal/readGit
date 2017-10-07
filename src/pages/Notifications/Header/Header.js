// @flow
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Layout from '../../../components/Layout';

class Header extends Component {
  onActionSelected = pos => {
    if (pos === 0) {
      Alert.alert('Group by', undefined, [
        {
          text: 'Date',
          onPress: () => {
            this.props.removeGroupRepo();
          },
        },
        {
          text: 'Repository',
          onPress: () => {
            this.props.addGroupRepo();
          },
        },
      ]);
    } else if (pos === 1) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Search' }));
    }
  };

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="Notifications"
        actions={[
          {
            title: 'Group by',
            show: 'always',
            iconName: 'filter-list',
          },
          {
            title: 'Search',
            show: 'always',
            iconName: 'search',
          },
        ]}
        onActionSelected={this.onActionSelected}
      />
    );
  }
}

export default Header;
