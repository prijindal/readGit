// @flow
import React from 'react';
import { StatusBar, View, Text, ToolbarAndroid } from 'react-native';

import { primary, textPrimary, primaryDark, transparent } from '../colors';

const styles = {
  toolbar: {
    height: 56,
    backgroundColor: primary
  },
  appbar: {
    height: 24,
    backgroundColor: primaryDark,
  }
}

const AppShell = () => (
  <View>
    <View style={styles.appbar} />
    <StatusBar
      backgroundColor={transparent}
      translucent={true}
    />
    <ToolbarAndroid
      title="Read Git"
      titleColor={textPrimary}
      style={styles.toolbar}
    />
  </View>
);

export default AppShell;
