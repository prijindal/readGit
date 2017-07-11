/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { white, textDarkPrimary, textDarkSecondary } from '../colors';

const Container = styled.View`
  background-color: ${white.toString()};
  padding-horizontal: 16;
  height: 48;
  align-items: center;
  flex-direction: row;
`

const MenuIcon = styled(Icon)`
  font-size: 24;
`

const Text = styled.Text`
  font-size: 14;
  font-weight: 500;
  font-family: sans-serif-light;
  padding-left: 32;
  color: ${textDarkPrimary.toString()};
`

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
        <Container>
          <MenuIcon name={icon} style={{ color: iconColor }} />
          <Text style={{ color: textColor }}>{name}</Text>
        </Container>
      </TouchableNativeFeedback>
    );
  }
}

export default MenuItem;
