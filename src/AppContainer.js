// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { saveUser } from './actions/user';

import configureStore from './configureStore';
import AppNavigator from './components/AppNavigator';
import AppShell from './components/AppShell';

const store = configureStore();

class AppContainer extends Component {
  constructor(props: any) {
    super(props)
    this.saveToken();
  }

  state = {
    loaded: false,
  }

  saveToken = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    store.dispatch(saveUser(user))
    this.setState({
      loaded: true,
    })
  }

  render() {
    if(!this.state.loaded) return <AppShell />
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}

export default AppContainer;
