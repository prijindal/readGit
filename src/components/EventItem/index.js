/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TouchableNativeFeedback, View, Text, Image } from 'react-native';
import { textDarkPrimary, textDarkDivider, textDarkSecondary, white } from '../../colors';
import { getInfo } from './functions';

const styles = {
  view: {
    elevation: 2,
    borderColor: textDarkDivider,
    backgroundColor: white,
    borderBottomWidth: 1,
    minHeight: 56,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
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
  date: {
    color: textDarkSecondary,
    fontSize: 14,
  }
};

class EventItem extends PureComponent {
  static defaultProps = {
    idx: 0,
    length: 1,
    infoExtractor: null,
  }

  static propTypes = {
    idx: PropTypes.number,
    length: PropTypes.number,
    item: PropTypes.shape({}).isRequired,
    infoExtractor: PropTypes.func,
  }

  getInfo = () => getInfo(this.props.item);

  getDate = () => {
    return moment(this.props.item.created_at).fromNow();
  }

  render() {
    const { item } = this.props;
    const { title, body } = this.getInfo();
    // if(item.type !== this.getTitle()) {
    //   return <View></View>
    // }
    return (
      <TouchableNativeFeedback onPress={this.onPress}>
        <View style={styles.view}>
          {item.image &&
            <Image source={{ uri: item.image }} style={styles.image} />
          }
          <View style={styles.content}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.date}>{this.getDate()}</Text>
            {body}
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export default EventItem;
