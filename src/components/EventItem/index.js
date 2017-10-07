/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components/native';
import TouchablePlatformFeedback from '../TouchablePlatformFeedback';

import getInfo from './functions';

import { Container, Text, Title, Content } from '../ListItem';

const ContainerView = styled(Container)`
  margin-horizontal: 8;
  margin-vertical: 4;
  padding-horizontal: 0;
`;

const ContentView = styled(Content)`
  max-width: 320;
`;

const TitleText = styled(Title)`
  font-size: 16;
`;

class EventItem extends Component {
  static propTypes = {
    item: PropTypes.shape({}).isRequired,
    onPress: PropTypes.func,
  };

  state = {
    event: getInfo(this.props.item),
  };

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return false;
  }

  getDate = () => {
    return moment(this.props.item.created_at).fromNow();
  };

  onPress = () => {
    if (this.state.event.link) {
      this.props.onPress(this.state.event.link);
    }
  };

  render() {
    const { title, body } = this.state.event;
    return (
      <TouchablePlatformFeedback onPress={this.onPress}>
        <ContainerView>
          <ContentView>
            <TitleText>{title}</TitleText>
            <Text>{this.getDate()}</Text>
            {body}
          </ContentView>
        </ContainerView>
      </TouchablePlatformFeedback>
    );
  }
}

export default EventItem;
