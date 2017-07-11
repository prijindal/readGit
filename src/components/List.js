/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';

import { textDarkDivider } from '../colors';

const Container = styled.View`
  padding-vertical: 8;
  border-bottom-width: 1;
  border-color: ${textDarkDivider.toString()};
`

class List extends Component {
  static defaultProps = {
    noBorder: false,
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    noBorder: PropTypes.bool,
  }

  render() {
    return (
      <Container style={{ borderBottomWidth: this.props.noBorder ? 0 : 1 }}>
        {this.props.children}
      </Container>
    );
  }
}

export default List;
