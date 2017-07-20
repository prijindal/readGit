/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components/native';
import { TouchableNativeFeedback, View, Image } from 'react-native';
import { textDarkPrimary, textDarkDivider, textDarkSecondary, white } from '../../colors';
import getInfo from './functions';

import { Container, Text, Title, Content } from '../ListItem';

const ContainerView = styled(Container)`
  margin-horizontal: 8;
  margin-vertical: 4;
  padding-horizontal: 0;
`

const ContentView = styled(Content)`
  max-width: 320;
`

const TitleText = styled(Title)`
  font-size: 16;
`

class EventItem extends Component {

  static propTypes = {
    item: PropTypes.shape({}).isRequired,
    onPress: PropTypes.func,
  }

  state = {
    event: getInfo(this.props.item),
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  getDate = () => {
    return moment(this.props.item.created_at).fromNow();
  }

  onPress = () => {
    if(this.state.event.link) {
      this.props.onPress(this.state.event.link);
    }
  }

  render() {
    const { item } = this.props;
    const { title, body, link } = this.state.event;
    return (
      <TouchableNativeFeedback onPress={this.onPress}>
        <ContainerView>
          <ContentView>
            <TitleText>{title}</TitleText>
            <Text>{this.getDate()}</Text>
            {body}
          </ContentView>
        </ContainerView>
      </TouchableNativeFeedback>
    );
  }
}

export default EventItem;
