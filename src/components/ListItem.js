/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TouchableNativeFeedback, View, Text, Image } from 'react-native';
import { textDarkPrimary, textDarkSecondary, textDarkDivider, white } from '../colors';

const styles = {
  view: {
    elevation: 2,
    borderColor: textDarkDivider,
    backgroundColor: white,
    borderBottomWidth: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    maxWidth: 270
  },
  text: {
    color: textDarkPrimary,
    fontSize: 18,
  },
  body: {
    color: textDarkSecondary,
    fontSize: 14,
  },
  date: {
    color: textDarkSecondary,
    fontSize: 14,
  }
};

class ListItem extends PureComponent {
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
        <View style={styles.view}>
          {item.image &&
            <Image source={{ uri: item.image }} style={styles.image} />
          }
          <View style={styles.content}>
            <Text style={[styles.text, textStyles]} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.body, textStyles]} ellipsizeMode="tail" numberOfLines={1}>{item.body}</Text>
          </View>
          <View>
            <Text style={[styles.date, textStyles]}>{this.getTime()}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default ListItem;
