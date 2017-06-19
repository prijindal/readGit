// @flow
import React, { Component } from 'react';
import AppShell from './components/AppShell';
import RootNavigator from './RootNavigator';

export default class Root extends Component {
  componentWillMount() {
    // setTimeout(() =>
    //   this.setState({
    //     loading: false
    //   }),
    //   2000)
  }

  state = {
    loading: true
  }

  render() {
    if(this.state.loading) {
      return (
        <AppShell />
      );
    } else {
      return (
        <RootNavigator />
      );
    }
  }
}
