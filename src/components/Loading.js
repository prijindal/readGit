// @flow
import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { primary } from '../colors';

const View = styled.View`
  padding-vertical: 12;
`

const Loading = () => (
  <View>
    <ActivityIndicator color={primary} size={24}/>
  </View>
)


export default Loading;
