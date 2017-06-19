// @flow
import React, { Component } from 'react';
import { Text, Button, View, AsyncStorage, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { primary } from '../colors';
import Layout from '../components/Layout/Layout';
import sleep from '../helpers/sleep';

const navigateToApp = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'App',
    })
  ]
})

const styles = {
  textfield: {
    height: 56,
    marginHorizontal: 4,
    paddingHorizontal: 8,
  },
  button: {
    height: 56,
    marginVertical: 8,
    paddingHorizontal: 8,
  }
}

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    loading: false,
  }
  passwordInput: any;

  login = async () => {
    await this.setState({
      loading: true,
    })
    await sleep(2000);
    // await AsyncStorage.setItem('token', 'token');
    // const user = {user: 'user'}
    // await AsyncStorage.setItem('user', JSON.stringify(user));
    const { dispatch } = this.props.navigation;
    dispatch(navigateToApp);
  }

  render() {
    return (
      <Layout
        toolbarTitle="Login with Github"
      >
        <TextInput
          placeholder="Username"
          style={styles.textfield}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          returnKeyType="next"
          editable={!this.state.loading}
          onSubmitEditing={() => this.passwordInput.focus()}
          autoFocus
        />
        <TextInput
          placeholder="Password"
          ref={(c) => this.passwordInput = c}
          style={styles.textfield}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          editable={!this.state.loading}
          onSubmitEditing={this.login}
          returnKeyType="go"
          secureTextEntry
        />
        <View style={styles.button}>
          <Button
            color={primary}
            onPress={this.login}
            title="Login"
            disabled={!this.state.username || !this.state.password || this.state.loading}
          />
        </View>
      </Layout>
    )
  }
}
