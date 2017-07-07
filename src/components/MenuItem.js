/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { white, textDarkPrimary, textDarkSecondary } from '../colors';

const styles = {
  view: {
    backgroundColor: white,
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    fontSize: 24,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'sans-serif-light',
    paddingLeft: 32,
    color: textDarkPrimary,
  },
};

class MenuItem extends Component {
  static defaultProps = {
    iconColor: textDarkSecondary,
    textColor: textDarkPrimary,
    onPress: () => {},
  }

  static propTypes = {
    item: PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
    }).isRequired,
    iconColor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    textColor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onPress: PropTypes.func,
  }

  render() {
    const { item, iconColor, textColor, onPress } = this.props;
    const { name, icon } = item;
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.view}>
          <Icon name={icon} style={[styles.icon, { color: iconColor }]} />
          <Text style={[styles.text, { color: textColor }]}>{name}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default MenuItem;
