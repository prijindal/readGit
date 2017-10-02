// @flow
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { primary, textPrimary } from '../colors';
import Toolbar from './Toolbar'

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
    <Toolbar
      title="Read Git"
      titleColor={textPrimary}
      style={styles.toolbar}
    />
  </View>
);

export default AppShell;
