// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppNavigator from './AppNavigator';

const LoginScreen = () => (
  <View>
    <Text>Login Screen</Text>
  </View>
)

const RootNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  App: { screen: AppNavigator },
}, {
  headerMode: 'none',
});

export default RootNavigator;
