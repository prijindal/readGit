// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

const HomeScreen = () => (
  <View>
    <Text>Home Screen</Text>
  </View>
)

const AppNavigator = StackNavigator({
  Home: { screen: HomeScreen },
}, {
  headerMode: 'none',
});

export default AppNavigator;
