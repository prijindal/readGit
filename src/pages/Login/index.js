// @flow
import React, { Component } from 'react';
import { Button, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { primary } from '../../colors';
import Layout from '../../components/Layout/Layout';
import btoa from '../../helpers/btoa';

import graphqlFetch from '../../helpers/graphqlFetch';
import { CLIENT_ID, CLIENT_SECRET, scopes, GIT_APP_NAME } from '../../tokens';

import UserCredentials from './UserCredentials';
import OtpInput from './OtpInput';

const navigateToApp = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'Home',
    })
  ]
})

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    otpinput: false
  }

  tryLogin = async (username: string, password: string, otp?: string) => {
    let headers = {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    };
    if (otp) {
      headers['X-GitHub-OTP'] = otp;
    }
    let options = {
      headers,
      body: JSON.stringify({
        'scopes': scopes,
        'note': GIT_APP_NAME,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
      }),
      method: 'POST'
    }
    let resp = await fetch('https://api.github.com/authorizations', options);
    return resp;
  }

  successLogin = async ({ token }: { token: string }) => {
    let query = `{
    	viewer {
        id
        login
        name
        email
      }
    }`
    let resp = await graphqlFetch({ query, token })
    let user = resp.data.viewer;
    user.token = token;
    await AsyncStorage.setItem('user', JSON.stringify(user));
    const { dispatch } = this.props.navigation;
    dispatch(navigateToApp);
  }

  onLogin = async ({ username, password }: { username: string, password: string }) => {
    let resp = await this.tryLogin(username, password)
    let otpRequest = resp.headers.get('x-github-otp');
    if(otpRequest && otpRequest.search('required') === 0) {
      this.setState({
        otpinput: true,
        username,
        password
      })
    } else {
      resp = await resp.json();
      this.successLogin(resp);
    }
  }

  onOtpVerify = async({ otp }: { otp: string }) => {
    let resp = await this.tryLogin(this.state.username, this.state.password, otp);
    console.log(resp);
    resp = await resp.json();
    this.successLogin(resp);
  }

  render() {
    return (
      <Layout
        toolbarTitle="Login with Github"
      >
        {this.state.otpinput ?
          <OtpInput onSubmit={this.onOtpVerify}/> :
          <UserCredentials onSubmit={this.onLogin}/>
        }
      </Layout>
    )
  }
}
