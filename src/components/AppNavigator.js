// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DrawerLayoutAndroid, BackAndroid, Dimensions } from 'react-native';
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
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  drawer: any
  approutes: any

  registerBackButton() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
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
  }


  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={this.drawerWidth()}
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
