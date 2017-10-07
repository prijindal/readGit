// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DrawerLayoutAndroid, BackHandler, Dimensions } from 'react-native';
import { closeDrawer, openDrawer } from '../actions/drawer';

import AppBar from '../components/AppBar';
import SideBar from '../components/SideBar';

import AppRoutes from '../AppRoutes';

class DrawerNavigator extends Component {
  componentDidMount() {
    this.registerBackButton();
  }

  componentWillReceiveProps({ drawer }) {
    if (drawer) {
      this.drawer.openDrawer();
    } else {
      this.drawer.closeDrawer();
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  drawer: any;
  approutes: any;

  registerBackButton() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.drawer) {
        this.drawer.closeDrawer();
        return true;
      }
      return false;
    });
  }

  drawerWidth = () => {
    const { width } = Dimensions.get('window');
    if (width - 56 > 320) {
      return 320;
    }
    return width - 56;
  };

  dispatch = config => {
    this.approutes.dispatch(config);
  };

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={this.drawerWidth()}
        ref={c => (this.drawer = c)}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => <SideBar dispatch={this.dispatch} />}
        onDrawerOpen={this.props.onDrawerOpen}
        onDrawerClose={this.props.onDrawerClose}>
        <AppBar />
        <AppRoutes ref={c => (this.approutes = c)} />
      </DrawerLayoutAndroid>
    );
  }
}

export default connect(
  ({ drawer }) => ({ drawer }),
  dispatch => ({
    onDrawerOpen: () => dispatch(openDrawer()),
    onDrawerClose: () => dispatch(closeDrawer()),
  })
)(DrawerNavigator);
