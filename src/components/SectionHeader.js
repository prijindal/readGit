// @flow
import React, { PureComponent } from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import TouchablePlatformFeedback from './TouchablePlatformFeedback';

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
  font-size: 18;
`

const EmptyView = styled.Text`
  padding-vertical: 12;
  font-size: 20;
`

class SectionHeader extends PureComponent {
  render() {
    return (
      <TouchablePlatformFeedback onPress={this.props.onPress}>
        <View>
          <Title>{this.props.title}</Title>
          {this.props.disabled ?
            <EmptyView/> :
            <StyledIcon name="playlist-add-check"/>
          }
        </View>
      </TouchablePlatformFeedback>
    )
  }
}

export default SectionHeader;
