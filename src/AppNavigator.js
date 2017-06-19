// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomePage from './pages/Home';

const AppNavigator = StackNavigator({
  Home: { screen: HomePage },
}, {
  headerMode: 'none',
});

export default AppNavigator;
