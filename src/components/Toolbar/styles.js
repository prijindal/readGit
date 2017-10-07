import styled from 'styled-components/native';
import { primary, textPrimary, textSecondary } from '../../colors';

export const Container = styled.View`
  height: 56;
  background-color: ${primary.toString()};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  elevation: 2;
`;

export const LeftIcon = styled.View`
  background-color: transparent;
  border-radius: 50;
  padding-vertical: 8;
  padding-horizontal: 12;
`;

export const TitleContainer = styled.View`
  flex-direction: column;
  margin-horizontal: 4;
  flex-grow: 1;
`;

export const Title = styled.Text`
  color: ${textPrimary.toString()};
  font-size: 20;
`;

export const Subtitle = styled.Text`
  color: ${textSecondary.toString()};
`;

export const RightIconsContainer = styled.View`
  padding-vertical: 8;
  flex-direction: row;
`;
