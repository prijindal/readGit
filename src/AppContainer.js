// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { saveUser } from './actions/user';

import AppNavigator from './components/AppNavigator';
import AppShell from './components/AppShell';
import ErrorScreen from './components/ErrorScreen';
import store from './store';
import client, { installAuthentication } from './apollo';

class AppContainer extends Component {
  constructor(props: any) {
    super(props);
    this.getUserInfo();
  }

  state = {
    loaded: false,
    error: null,
  };

  getUserInfo = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      console.log(user);
      user = JSON.parse(user);
      store.dispatch(saveUser(user));
      installAuthentication(user.token);
      this.setState({
        loaded: true,
        error: null,
      });
    } catch (e) {
      console.error(e)
      this.setState({
        error: e,
      });
    }
    // let settings = await AsyncStorage.getItem('settings');
    // settings = JSON.parse(settings);
    // store.dispatch(saveSettings(settings));
  };

  render() {
    if (this.state.error) return <ErrorScreen error={this.state.error} />;
    if (!this.state.loaded) return <AppShell />;
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </ApolloProvider>
    );
  }
}

export default AppContainer;
