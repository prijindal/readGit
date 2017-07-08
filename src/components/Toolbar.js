// @flow
import React from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import Icon, { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';

import { primary, textPrimary, transparent, textSecondary } from '../colors';

const styles = {
  toolbar: {
    height: 56,
    backgroundColor: primary,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
  },
  leftIcon: {
    backgroundColor: transparent,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  titleContainer: {
    flexDirection: 'column',
    marginHorizontal: 4
  },
  title: {
    color: textPrimary,
    fontSize: 20,
  },
  subtitle: {
    color: textSecondary,
  }
}

const Toolbar = ({ title, onIconClicked, subtitle, navIconName }: any) => (
  <View style={styles.toolbar}>
    <TouchableNativeFeedback onPress={onIconClicked} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
      <View style={styles.leftIcon}>
        <Icon name={navIconName} size={24} color={textPrimary.toString()}/>
      </View>
    </TouchableNativeFeedback>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{ title }</Text>
      {subtitle !== undefined &&
        <Text style={styles.subtitle}>{subtitle}</Text>
      }
    </View>
  </View>
);

export default Toolbar;
