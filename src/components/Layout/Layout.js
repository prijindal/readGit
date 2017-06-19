// @flow
import React from 'react';
import { View } from 'react-native';
import { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';

import { primary, textPrimary } from '../../colors';

const styles = {
  toolbar: {
    height: 56,
    backgroundColor: primary
  }
}

const Layout = ({ children, toolbarTitle='Read Git', menuEnabled=false, openDrawer, backButton=false, onBackButtonPress }: any) => (
  <View>
    <ToolbarAndroid
      titleColor={textPrimary}
      style={styles.toolbar}
      title={toolbarTitle}
      navIconName={menuEnabled ? 'menu' : (backButton ? 'arrow-back' : null)}
      onIconClicked={menuEnabled ? openDrawer : onBackButtonPress}
    />
    {children}
  </View>
);

export default Layout;
