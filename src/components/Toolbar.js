// @flow
import React from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import styled from 'styled-components/native';
import Icon, { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';

import { primary, textPrimary, transparent, textSecondary } from '../colors';

export const Container = styled.View`
  height: 56;
  background-color: ${primary.toString()};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  elevation: 2;
`

export const LeftIcon = styled.View`
  background-color: transparent;
  border-radius: 50;
  padding-vertical: 8;
  padding-horizontal: 12;
`

export const TitleContainer = styled.View`
  flex-direction: column;
  margin-horizontal: 4;
  flex-grow:1;
`

export const Title = styled.Text`
  color: ${textPrimary.toString()};
  font-size: 20;
`

export const Subtitle = styled.Text`
  color: ${textSecondary.toString()};
`

export const RightIconsContainer = styled.View`
  padding-vertical: 8;
  flex-direction: row;
`;

export const RightIcon = ({name, size, onPress, color=textPrimary.toString()}: { name: string, size: number, onPress: any, color: string }) => (
  <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
    <LeftIcon>
      <Icon name={name} size={size} color={color}/>
    </LeftIcon>
  </TouchableNativeFeedback>
)

const Toolbar = ({ title, onIconClicked, subtitle, navIconName, titleColor, subtitleColor, actions=[], onActionSelected = () => {} }: any) => (
  <Container>
    <TouchableNativeFeedback onPress={onIconClicked} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
      <LeftIcon>
        <Icon name={navIconName} size={24} color={textPrimary.toString()}/>
      </LeftIcon>
    </TouchableNativeFeedback>
    <TitleContainer>
      <Title style={{color: titleColor}}>{ title }</Title>
      {subtitle !== undefined &&
        <Subtitle style={{color: subtitleColor}}>{subtitle}</Subtitle>
      }
    </TitleContainer>
    <RightIconsContainer>
      {actions.map((action, idx) =>
        <RightIcon key={idx} name={action.iconName} size={24} onPress={() => onActionSelected(idx, action)}/>
      )}
    </RightIconsContainer>
  </Container>
);

// const ToolbarAndroidStyled = styled(ToolbarAndroid)`
//   height: 56;
//   elevation: 8;
//   background-color: ${primary.toString()};
// `
//
// export default ToolbarAndroidStyled;

export default Toolbar;
