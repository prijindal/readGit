// @flow
import React, { Component } from 'react';
import { View, ToastAndroid } from 'react-native';
import { Button } from 'react-native';

import { primary } from '../../colors';
import sleep from '../../helpers/sleep';

import { TextInput, ErrorText, ButtonContainer } from './formcomponents';

export default class OtpInput extends Component {
  state = {
    otp: '',
    loading: false,
  }

  login = async () => {
    await this.setState({
      loading: true,
    })
    this.props.onSubmit({
      otp: this.state.otp,
    })
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="OTP"
          onChangeText={(otp) => this.setState({otp})}
          value={this.state.otp}
          editable={!this.state.loading}
          onSubmitEditing={this.login}
          returnKeyType="go"
          autoFocus
        />
        {this.state.error != undefined &&
          <ErrorText>{this.state.error}</ErrorText>
        }
        <ButtonContainer>
          <Button
            color={primary}
            onPress={this.login}
            title="Verify"
            disabled={!this.state.otp || this.state.loading}
          />
        </ButtonContainer>
      </View>
    )
  }
}
