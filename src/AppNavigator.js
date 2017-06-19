// @flow
import React from 'react';
import { Text, View, DrawerLayoutAndroid } from 'react-native';
import { StackNavigator } from 'react-navigation';

import AppBar from './components/AppBar';
import HomePage from './pages/Home';

const AppNavigator = StackNavigator({
  Home: { screen: HomePage },
}, {
  headerMode: 'none',
});

const SideBar = () => (
  <View>
    <Text>Side bar</Text>
  </View>
)

const DrawerNavigator = () => (
  <DrawerLayoutAndroid
    drawerWidth={300}
    drawerPosition={DrawerLayoutAndroid.positions.Left}
    renderNavigationView={() => SideBar}>
    <AppBar />
    <AppNavigator />
  </DrawerLayoutAndroid>
);

export default DrawerNavigator;
