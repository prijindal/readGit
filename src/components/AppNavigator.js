// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Dimensions } from 'react-native';
import Drawer from 'react-native-drawer';
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
      this.drawer.open();
    } else {
      this.drawer.close();
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
        this.drawer.close();
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
      <Drawer
        type="overlay"
        tapToClose
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        captureGestures
        elevation={4}
        drawerWidth={this.drawerWidth()}
        ref={c => (this.drawer = c)}
        content={<SideBar dispatch={this.dispatch} />}
        onOpen={this.props.onDrawerOpen}
        onClose={this.props.onDrawerClose}>
        <AppBar />
        <AppRoutes ref={c => (this.approutes = c)} />
      </Drawer>
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
