// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { saveUser } from './actions/user';

import AppNavigator from './components/AppNavigator';
import AppShell from './components/AppShell';
import store from './store';
import client, { installAuthentication } from './apollo';

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
    installAuthentication(user.token);
    this.setState({
      loaded: true,
    })
  }

  render() {
    if(!this.state.loaded) return <AppShell />
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </ApolloProvider>
    )
  }
}

export default AppContainer;
