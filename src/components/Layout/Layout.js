// @flow
import React from 'react';
import { View } from 'react-native';

import Toolbar from '../Toolbar';

import { textSecondary, textPrimary } from '../../colors';

const Layout = ({ children, toolbarTitle='Read Git', toolbarSubitle, menuEnabled=false, openDrawer, backButton=false, onBackButtonPress, actions, onActionSelected }: any) => (
  <View>
    <Toolbar
      titleColor={textPrimary}
      subtitleColor={textSecondary}
      actions={actions}
      onActionSelected={onActionSelected}
      title={toolbarTitle}
      subtitle={toolbarSubitle}
      navIconName={menuEnabled ? 'menu' : (backButton ? 'arrow-back' : null)}
      onIconClicked={menuEnabled ? openDrawer : onBackButtonPress}
    />
    {children}
  </View>
);

export default Layout;
