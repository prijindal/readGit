/* @flow */
import React, { Component, PropTypes } from 'react';
import { ScrollView, Text, Image, View, Alert, AsyncStorage } from 'react-native';
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


const user = {
  name: 'Priyanshu Jindal',
  email: 'priyanshujindal1995@gmail.com',
  uri: 'https://lh3.googleusercontent.com/AQReAe_Kc0b7vEpY68NmyinordjwmTI9YAstfxNA8uZUlmyv7q8N1wVsgBUxq697e10dHg=s630',
  avatar: 'https://avatars2.githubusercontent.com/u/10034872?v=3&s=460',
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
    console.log(this.props)
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

  render() {
    return (
      <View onLayout={this.onScrollViewLayout} style={styles.container}>
        <ScrollView>
          <Image
            source={{ uri: user.uri }}
            style={[styles.image, { height: this.state.imageHeight }]}
          >
            <View style={styles.imageOverlay}>
              <Image
                style={styles.avatar}
                source={{ uri: user.avatar }}
              />
              <View style={styles.profileInfoContainer}>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                </View>
              </View>
            </View>
          </Image>
          <View style={styles.list}>
            <List>
              <MenuItem
                item={{ name: 'Home', icon: 'drafts' }}
                onPress={() => this.openPage('Home')}
              />
              <MenuItem
                item={{ name: 'My Orders', icon: 'send' }}
                onPress={() => this.openPage('myorders')}
              />
              <MenuItem
                item={{ name: 'Claim Orders', icon: 'touch-app' }}
                onPress={() => this.openPage('claimorders')}
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
