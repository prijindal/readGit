// @flow
import React from 'react';
import { View, Image } from 'react-native';

const styles = {
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }
}

const Avatar = ({ url, style }) => (
  <Image source={{uri: url}} style={[styles.avatar, style]}/>
)

export default Avatar;
