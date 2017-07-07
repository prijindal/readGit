/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { textDarkDivider } from '../colors';

const styles = {
  view: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: textDarkDivider,
  },
};

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
      <View style={[styles.view, { borderBottomWidth: this.props.noBorder ? 0 : 1 }]}>
        {this.props.children}
      </View>
    );
  }
}

export default List;
