// @flow
import React from 'react';
import { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';

import { primary, textPrimary } from '../colors';

const styles = {
  toolbar: {
    height: 56,
    backgroundColor: primary
  }
}

const Toolbar = ({ children }: any) => (
  <ToolbarAndroid
    title="Read Git"
    {...children}
  />
);

export default Toolbar;
