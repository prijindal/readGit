// @flow
import React, { PureComponent } from 'react';
import { Text, View, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { textDisabled, transparent, textDarkPrimary } from '../colors';

const styles=  {
  container: {
    backgroundColor: textDisabled,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  title: {
    color: textDarkPrimary
  },
  icon: {
    color: textDarkPrimary,
    paddingVertical: 8,
  }
}

class SectionHeader extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Icon style={styles.icon} size={18} name="playlist-add-check"/>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

export default SectionHeader;
