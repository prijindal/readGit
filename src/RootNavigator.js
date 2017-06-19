// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppNavigator from './AppNavigator';

import LoginPage from './pages/Login';

const RootNavigator = StackNavigator({
  Login: { screen: LoginPage },
  App: { screen: AppNavigator },
}, {
  headerMode: 'none',
});

export default RootNavigator;
