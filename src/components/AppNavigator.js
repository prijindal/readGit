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
    console.log(this.approutes);
    if (drawer) {
      this.drawer.openDrawer();
    } else {
      this.drawer.closeDrawer();
    }
  }

  drawer: any
  approutes: any

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={(c) => this.drawer = c}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() =>
          <SideBar dispatch={this.drawer ? this.drawer.dispatch : () => ({})}/>
        }
        onDrawerOpen={this.props.onDrawerOpen}
        onDrawerClose={this.props.onDrawerClose}
      >
        <AppBar />
        <AppRoutes ref={(c) => this.approutes = c}/>
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
