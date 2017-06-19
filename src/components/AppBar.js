// @flow
import React from 'react';
import { StatusBar, View, Text, ToolbarAndroid } from 'react-native';

import { primaryDark, transparent } from '../colors';

const styles = {
  appbar: {
    height: 24,
    backgroundColor: primaryDark,
  }
}

const AppStatusBar = () => (
  <View>
    <View style={styles.appbar} />
    <StatusBar
      backgroundColor={transparent}
      translucent={true}
    />
  </View>
)

export default AppStatusBar;
