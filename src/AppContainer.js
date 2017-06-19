// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { saveUser } from './actions/user';

import configureStore from './configureStore';
import AppNavigator from './components/AppNavigator';

const store = configureStore();

class AppContainer extends Component {
  constructor(props: any) {
    super(props)
    this.saveToken();
  }

  saveToken = async () => {
    let token = await AsyncStorage.getItem('token');
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    store.dispatch(saveUser({
      ...user,
      token
    }))
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}

export default AppContainer;
