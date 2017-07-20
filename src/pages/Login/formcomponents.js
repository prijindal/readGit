import styled from 'styled-components/native';
import { primary, errorColor } from '../../colors';

export const TextInput = styled.TextInput`
  height: 56;
  margin-horizontal: 4;
  padding-horizontal: 8;
`

export const ErrorText = styled.Text`
  text-align: 'left';
  color: ${errorColor.toString()};
  margin-vertical: 8;
  margin-horizontal: 12;
`

export const ButtonContainer = styled.View`
  height: 56;
  margin-horizontal: 8;
  padding-horizontal: 8;
`
