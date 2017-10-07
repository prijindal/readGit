// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import AppShell from './components/AppShell';
import RootNavigator from './RootNavigator';
import AppContainer from './AppContainer';
import ErrorScreen from './components/ErrorScreen';

export default class Root extends Component {
  constructor(props: any) {
    super(props);
    this.checkToken();
  }

  checkToken = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      this.setState({
        loading: false,
        loggedin: user !== undefined,
        error: null,
      });
    } catch (e) {
      this.setState({
        error: e,
      });
    }
  };

  state = {
    loading: true,
    loggedin: false,
    error: null,
  };

  render() {
    const { loading, loggedin, error } = this.state;
    if (error) {
      return <ErrorScreen error={error} />;
    }
    if (loading) {
      return <AppShell />;
    } else if (loggedin) {
      return <AppContainer />;
    } else {
      return <RootNavigator />;
    }
  }
}
