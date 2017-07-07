// @flow
import React from 'react';
import { View } from 'react-native';
// import { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';

import Toolbar from '../Toolbar';

import { primary, textPrimary } from '../../colors';

const Layout = ({ children, toolbarTitle='Read Git', toolbarSubitle, menuEnabled=false, openDrawer, backButton=false, onBackButtonPress }: any) => (
  <View>
    <Toolbar
      titleColor={textPrimary}
      title={toolbarTitle}
      subtitle={toolbarSubitle}
      navIconName={menuEnabled ? 'menu' : (backButton ? 'arrow-back' : null)}
      onIconClicked={menuEnabled ? openDrawer : onBackButtonPress}
    />
    {children}
  </View>
);

export default Layout;
