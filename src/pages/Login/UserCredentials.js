// @flow
import React, { Component } from 'react';
import { View, ToastAndroid } from 'react-native';
import { Button } from 'react-native';

import { primary } from '../../colors';
import sleep from '../../helpers/sleep';

import { TextInput, ErrorText, ButtonContainer } from './formcomponents';

export default class UserCredentials extends Component {
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
    this.props.onSubmit({
      username: this.state.username,
      password: this.state.password
    })
  }

  onUsernameSubmit = () => {
    this.passwordInput.root.focus();
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Username"
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          returnKeyType="next"
          editable={!this.state.loading}
          onSubmitEditing={this.onUsernameSubmit}
          autoFocus
        />
        <TextInput
          placeholder="Password"
          ref={(c) => this.passwordInput = c}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          editable={!this.state.loading}
          onSubmitEditing={this.login}
          returnKeyType="go"
          secureTextEntry
        />
        {this.state.error != undefined &&
          <ErrorText>{this.state.error}</ErrorText>
        }
        <ButtonContainer>
          <Button
            color={primary}
            onPress={this.login}
            title="Login"
            disabled={!this.state.username || !this.state.password || this.state.loading}
          />
        </ButtonContainer>
      </View>
    )
  }
}
