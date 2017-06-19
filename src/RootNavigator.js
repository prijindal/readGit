// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppContainer from './AppContainer';

import LoginPage from './pages/Login';

const RootNavigator = StackNavigator({
  Login: { screen: LoginPage },
  Home: { screen: AppContainer },
}, {
  headerMode: 'none',
});

export default RootNavigator;
