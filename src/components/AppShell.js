// @flow
import React from 'react';
import { View, ToolbarAndroid } from 'react-native';

import { primary, textPrimary } from '../colors';

import AppBar from './AppBar';

const styles = {
  toolbar: {
    height: 56,
    backgroundColor: primary
  }
}

const AppShell = () => (
  <View>
    <AppBar />
    <ToolbarAndroid
      title="Read Git"
      titleColor={textPrimary}
      style={styles.toolbar}
    />
  </View>
);

export default AppShell;
