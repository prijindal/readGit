import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

import { textPrimary } from '../../colors';
import { LeftIcon } from './styles';

const RightIcon = ({ name, size, onPress, color = textPrimary.toString() }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.2}>
    <LeftIcon>
      <Icon name={name} size={size} color={color} />
    </LeftIcon>
  </TouchableOpacity>
);

export default RightIcon;
