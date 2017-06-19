// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DrawerLayoutAndroid } from 'react-native';
import { closeDrawer, openDrawer } from '../actions/drawer';

import AppBar from '../components/AppBar';
import SideBar from '../components/SideBar';

import AppRoutes from '../AppRoutes';

class DrawerNavigator extends Component {
  componentWillReceiveProps({ drawer }) {
    if (drawer) {
      this.drawer.openDrawer();
    } else {
      this.drawer.closeDrawer();
    }
  }

  drawer: any

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={(c) => this.drawer = c}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => SideBar}
        onDrawerOpen={this.props.onDrawerOpen}
        onDrawerClose={this.props.onDrawerClose}
      >
        <AppBar />
        <AppRoutes />
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
