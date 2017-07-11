// @flow
import React from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import styled from 'styled-components/native';
import Icon, { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';

import { primary, textPrimary, transparent, textSecondary } from '../colors';

const Container = styled.View`
  height: 56;
  background-color: ${primary.toString()};
  flex-direction: row;
  align-items: center;
  elevation: 8;
`

const LeftIcon = styled.View`
  background-color: transparent;
  border-radius: 50;
  padding-vertical: 8;
  padding-horizontal: 12;
`

const TitleContainer = styled.View`
  flex-direction: column;
  margin-horizontal: 4;
`

const Title = styled.Text`
  color: ${textPrimary.toString()};
  font-size: 20;
`
const Subtitle = styled.Text`
  color: ${textSecondary.toString()};
`

const Toolbar = ({ title, onIconClicked, subtitle, navIconName }: any) => (
  <Container>
    <TouchableNativeFeedback onPress={onIconClicked} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
      <LeftIcon>
        <Icon name={navIconName} size={24} color={textPrimary.toString()}/>
      </LeftIcon>
    </TouchableNativeFeedback>
    <TitleContainer>
      <Title>{ title }</Title>
      {subtitle !== undefined &&
        <Subtitle>{subtitle}</Subtitle>
      }
    </TitleContainer>
  </Container>
);

export default Toolbar;
