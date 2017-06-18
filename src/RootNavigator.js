// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

const LoginScreen = () => (
  <View>
    <Text>Login Screen</Text>
  </View>
)

const RootNavigator = StackNavigator({
  Login: { screen: LoginScreen },
});

export default RootNavigator;
