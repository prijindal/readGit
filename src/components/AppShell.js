// @flow
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { primary, textPrimary } from '../colors';

import AppBar from './AppBar';

const styles = {
  toolbar: {
    height: 56,
    backgroundColor: primary
  }
}

const ToolbarAndroid = styled.ToolbarAndroid`
  height: 56;
  background-color: ${primary.toString()};
`

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
