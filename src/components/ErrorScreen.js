import React from 'react';
import { View, Text } from 'react-native';

const ErrorScreen = ({ error }) => (
  <View>
    <Text>{JSON.stringify(error)}</Text>
  </View>
);

export default ErrorScreen;
