// @flow
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Image = styled.Image`
  width: 50;
  height: 50;
  border-radius: 25;
`

const Avatar = ({ url, style }) => (
  <Image source={{uri: url}} style={style}/>
)

export default Avatar;
