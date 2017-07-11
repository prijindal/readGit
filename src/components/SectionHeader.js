// @flow
import React, { PureComponent } from 'react';
import { TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { textDisabled, transparent, textDarkPrimary } from '../colors';

const View = styled.View`
  background-color: ${textDisabled.toString()};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16;
`

const Title = styled.Text`
  color: ${textDarkPrimary.toString()}
`

const StyledIcon = styled(Icon)`
  color: ${textDarkPrimary.toString()};
  padding-vertical: 8;
`

class SectionHeader extends PureComponent {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View>
          <Title>{this.props.title}</Title>
          <StyledIcon size={18} name="playlist-add-check"/>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

export default SectionHeader;
