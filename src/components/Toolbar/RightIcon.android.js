import React from 'react';
import { TouchableNativeFeedback } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

import { textPrimary } from '../../colors';
import { LeftIcon } from './styles';

const RightIcon = ({ name, size, onPress, color = textPrimary.toString() }) => (
  <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
    <LeftIcon>
      <Icon name={name} size={size} color={color} />
    </LeftIcon>
  </TouchableNativeFeedback>
);

export default RightIcon;
