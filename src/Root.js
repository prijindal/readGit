// @flow
import React, { Component } from 'react';
import AppShell from './components/AppShell';
import RootNavigator from './RootNavigator';
import AppNavigator from './AppNavigator';

export default class Root extends Component {
  componentWillMount() {
    setTimeout(() =>
      this.setState({
        loading: false
      }),
      2000)
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
