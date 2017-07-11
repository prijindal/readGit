// @flow
import React from 'react';
import styled from 'styled-components/native';
import { StatusBar, View, Text, ToolbarAndroid } from 'react-native';

import { primaryDark, transparent } from '../colors';

const AppBar = styled.View`
  height: 24;
  background-color: ${primaryDark.toString()};
`

const AppStatusBar = () => (
  <View>
    <AppBar />
    <StatusBar
      backgroundColor={transparent}
      translucent={true}
    />
  </View>
)

export default AppStatusBar;
