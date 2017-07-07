/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, View, Text, Image } from 'react-native';
import { textDarkPrimary, textDarkDivider, white } from '../colors';

const styles = {
  view: {
    elevation: 2,
    borderColor: textDarkDivider,
    backgroundColor: white,
    borderBottomWidth: 1,
    minHeight: 56,
    alignItems: 'center',
    paddingHorizontal: 16,
    // justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    marginVertical: 8,
    width: 48,
    height: 48,
    borderRadius: 50,
  },
  content: {
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: textDarkPrimary,
    fontSize: 16,
  },
};

class ListItem extends PureComponent {
  static defaultProps = {
    idx: 0,
    length: 1,
    onPress: () => {},
    infoExtractor: null,
  }

  static propTypes = {
    idx: PropTypes.number,
    length: PropTypes.number,
    item: PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
      image: PropTypes.string,
    }).isRequired,
    onPress: PropTypes.func,
    infoExtractor: PropTypes.func,
  }

  getItem() {
    if (this.props.infoExtractor) {
      return this.props.infoExtractor(this.props.item);
    }
    return this.props.item;
  }

  getBody() {
    const MAX_LENGTH = 80;
    const { body } = this.getItem();
    if (!body) return '';
    if (body.length > MAX_LENGTH) {
      return body.substr(0, MAX_LENGTH);
    }
    return body;
  }

  getAdditionalStyles() {
    const { idx, length } = this.props;
    return {
      borderBottomWidth: idx === length - 1 ? 0 : 1,
    };
  }

  render() {
    const { onPress } = this.props;
    const item = this.getItem();
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={[styles.view, this.getAdditionalStyles()]}>
          {item.image &&
            <Image source={{ uri: item.image }} style={styles.image} />
          }
          <View style={styles.content}>
            <Text style={styles.text}>{item.title}</Text>
            <Text>{this.getBody()}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default ListItem;
