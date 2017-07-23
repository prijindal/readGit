/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, Image, View, Alert, AsyncStorage, TouchableNativeFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { white, textPrimary, textSecondary } from '../../colors';

import MenuItem from '../MenuItem';
import List from '../List';

const styles = {
  container: {
    flex: 1,
  },
  image: {
    height: 180,
    flex: 1,
    width: undefined,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageOverlay: {
    backgroundColor: 'hsla(0, 0%, 0%, 0.5)',
    height: 180,
    paddingTop: 46,
    flex: 1,
  },
  avatar: {
    marginLeft: 16,
    width: 62,
    height: 62,
    borderRadius: 50,
  },
  profileInfo: {
  },
  name: {
    opacity: 1,
    color: textPrimary,
    fontWeight: '500',
  },
  email: {
    opacity: 1,
    color: textSecondary,
  },
  profileInfoContainer: {
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
  },
  downArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  downArrow: {
    opacity: 1,
    fontSize: 24,
    color: white,
  },
  fixedView: {
    elevation: 8,
    backgroundColor: white,
  },
  list: {
    backgroundColor: white,
  },
};


class SideBar extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    dispatch: PropTypes.func,
    closeDrawer: PropTypes.func.isRequired,
  }

  state = {
    imageHeight: 180,
  }

  onScrollViewLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    const imageHeight = (width * 9) / 16;
    // Put in redux state
    this.setState({
      imageHeight,
    });
  }

  openPage = (page: any) => {
    this.props.closeDrawer();
    this.props.dispatch(NavigationActions.navigate({ routeName: page }),);
  }

  logout = () => {
    Alert.alert(
      'Logout?',
      'You can login again.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.logoutLogic();
          },
        },
      ],
      { cancelable: false },
    );
  }

  logoutLogic = () => {
    this.props.closeDrawer();
    this.props.logout();
    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Login',
        })
      ]
    }));
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
  }

  openUser = () => {
    let { user, data } = this.props
    if (!data.loading && !data.error) {
      user = data.viewer
    }
    this.props.closeDrawer();
    this.props.dispatch(NavigationActions.navigate({ routeName: 'User' , params: { user }}));
  }

  render() {
    let { user, data } = this.props
    if (!data.loading && !data.error) {
      user = data.viewer
    }
    return (
      <View onLayout={this.onScrollViewLayout} style={styles.container}>
        <ScrollView>
          <Image
            source={{ uri: user.avatarUrl }}
            style={[styles.image, { height: this.state.imageHeight }]}
          >
            <TouchableNativeFeedback onPress={this.openUser}>
              <View style={styles.imageOverlay}>
                <Image
                  style={styles.avatar}
                  source={{ uri: user.avatarUrl }}
                />
                <View style={styles.profileInfoContainer}>
                  <View style={styles.profileInfo}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </Image>
          <View style={styles.list}>
            <List>
              <MenuItem
                item={{ name: 'Notifications', icon: 'drafts' }}
                onPress={() => this.openPage('Home')}
              />
              <MenuItem
                item={{ name: 'News Feed', icon: 'person' }}
                onPress={() => this.openPage('NewsFeed')}
              />
              <MenuItem
                item={{ name: 'All Users', icon: 'person' }}
                onPress={() => this.openPage('Users')}
              />
            </List>
            <List>
              <MenuItem
                item={{ name: 'Logout', icon: 'exit-to-app' }}
                onPress={this.logout}
              />
            </List>
            <List>
              <MenuItem
                item={{ name: 'Settings', icon: 'settings' }}
                onPress={() => this.openPage('settings')}
              />
              <MenuItem
                item={{ name: 'Help and Feedback', icon: 'help' }}
                onPress={() => this.openPage('help')}
              />
            </List>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default SideBar;
