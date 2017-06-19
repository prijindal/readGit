// @flow
import React, { Component } from 'react';
import { Text, Button, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Layout from '../components/Layout';

const navigateToApp = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'App',
    })
  ]
})

export default class Login extends Component {
  login = async () => {
    let isSaved = await AsyncStorage.setItem('token', 'newtoken');
    const { dispatch } = this.props.navigation;
    dispatch(navigateToApp);
  }
  render() {
    return (
      <Layout
        toolbarTitle="Login"
      >
        <Text>Login Screen</Text>
        <Button
          onPress={this.login}
          title="Login"
        />
      </Layout>
    )
  }
}
