// @flow
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { primary } from '../colors';

const styles = {
  loading: {
    paddingVertical: 12,
  }
}

const Loading = () => (
  <View style={styles.loading}>
    <ActivityIndicator color={primary} size={24}/>
  </View>
)


export default Loading;
