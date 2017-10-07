// @flow
import React from 'react';

import { textPrimary } from '../../colors';
import { Container, TitleContainer, Title, Subtitle, RightIconsContainer } from './styles';
import RightIcon from './RightIcon';

const Toolbar = ({ title, onIconClicked, subtitle, navIconName, titleColor, subtitleColor, actions = [], onActionSelected = () => {} }: any) => (
  <Container>
    {navIconName && <RightIcon onPress={onIconClicked} name={navIconName} size={24} color={textPrimary.toString()} />}
    <TitleContainer>
      <Title style={{ color: titleColor }}>{title}</Title>
      {subtitle !== undefined && <Subtitle style={{ color: subtitleColor }}>{subtitle}</Subtitle>}
    </TitleContainer>
    <RightIconsContainer>
      {actions.map((action, idx) => <RightIcon key={idx} name={action.iconName} size={24} onPress={() => onActionSelected(idx, action)} />)}
    </RightIconsContainer>
  </Container>
);

export default Toolbar;
