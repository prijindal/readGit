/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components/native';
import { TouchableNativeFeedback, View } from 'react-native';
import { textDarkPrimary, textDarkSecondary, textDarkDivider, white } from '../colors';

export const Container = styled.View`
  elevation: 2;
  border-color: ${textDarkDivider.toString()};
  background-color: white;
  border-bottom-width: 1;
  min-height: 56;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16;
  flex-direction: row;
`

export const Content = styled.View`
  justify-content: center;
  padding-vertical: 8;
  padding-horizontal: 16;
  max-width: 270;
`

export const Image = styled.Image`
  margin-vertical: 8;
  width: 48;
  height: 48;
  border-radius: 50;
`

export const Title = styled.Text`
  color: ${textDarkPrimary.toString()};
  font-size: 18;
`

export const Text = styled.Text`
  color: ${textDarkSecondary.toString()};
  font-size: 14;
`

class ListItem extends Component {
  static defaultProps = {
    onPress: () => {},
    infoExtractor: null,
  }

  static propTypes = {
    item: PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
      image: PropTypes.string,
      date: PropTypes.string,
    }).isRequired,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (this.props.disabled !== nextProps.disabled) {
      return true;
    }
    return false;
  }

  getAdditionalStyles() {
    const { disabled } = this.props;
    return {
      fontWeight: disabled ? 'normal' : 'bold',
      color: textDarkPrimary
    };
  }

  getTime() {
    let { date } = this.props.item;
    date = moment(date);
    const TODAY_FORMAT = 'H:mm A'
    const ELSE_FORMAT = 'MMM D'
    return date.calendar(null, {
      sameDay: TODAY_FORMAT,
      lastDay: ELSE_FORMAT,
      lastWeek: ELSE_FORMAT,
      sameElse: ELSE_FORMAT
    });
  }

  render() {
    const { onPress } = this.props;
    const item = this.props.item;
    const textStyles = this.getAdditionalStyles();
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <Container>
          <Content>
            <Title style={textStyles} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Title>
            <Text style={textStyles} ellipsizeMode="tail" numberOfLines={1}>{item.body}</Text>
          </Content>
          {(item.date !== undefined) &&
            <View>
              <Text style={textStyles}>{this.getTime()}</Text>
            </View>
          }
          {item.image &&
            <Image source={{ uri: item.image }} />
          }
        </Container>
      </TouchableNativeFeedback>
    );
  }
}

export default ListItem;
