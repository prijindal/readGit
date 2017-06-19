// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import AppShell from './components/AppShell';
import RootNavigator from './RootNavigator';
import AppNavigator from './AppNavigator';

export default class Root extends Component {
  componentWillMount() {
    this.checkToken();
  }

  checkToken = async () => {
    let token = await AsyncStorage.getItem('token');
    this.setState({
      loading: false,
      loggedin: token != undefined,
    })
  }

  state = {
    loading: true,
    loggedin: false
  }

  render() {
    const { loading, loggedin } = this.state;
    if(loading) {
      return <AppShell />;
    } else if (loggedin) {
      return <AppNavigator />;
    } else {
      return <RootNavigator />
    }
  }
}
