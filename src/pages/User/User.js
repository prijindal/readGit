// @flow
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View, Linking, TouchableNativeFeedback } from 'react-native';

import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import {
  textDarkPrimary,
  textDarkSecondary,
  textDarkDivider,
  white,
  textPrimary,
  textSecondary,
  accent
} from '../../colors';

import PinnedRepositories from './PinnedRepositories';

const Image = styled.Image`
  margin-top: 8;
  width: 120;
  height: 120;
`

const Container = styled.ScrollView`
  padding-top: 8;
  background-color: ${textPrimary.toString()};
  padding-horizontal: 12;
`

const Partial = styled.View`
  flex-direction: row;
`

const Content = styled.View`
  padding-vertical: 8;
  padding-horizontal: 12;
`

export const Title = styled.Text`
  color: ${textDarkPrimary.toString()};
  font-size: 18;
`

export const Text = styled.Text`
  color: ${textDarkSecondary.toString()};
  font-size: 14;
`

export const Bio = styled(Text)`
  padding-horizontal: 4;
  padding-vertical: 16;
`

const Hyperlink = ({children, link}) => (
  <TouchableNativeFeedback onPress={() => Linking.openURL(link)}>
    <Text>{children}</Text>
  </TouchableNativeFeedback>
)

class User extends Component {
  render() {
    const { data } = this.props
    let { user } = this.props.navigation.state.params;
    if (!data.loading && !data.error) {
      user = data.repositoryOwner
    }
    return (
      <Layout
        backButton
        onBackButtonPress={() => this.props.navigation.goBack()}
        toolbarTitle={user.login}
        toolbarSubtitle={user.name}
      >
        <Container>
          <Partial>
            <Image source={{ uri: user.avatarUrl }}/>
            <Content>
              <Title>{user.name}</Title>
              <Text>{user.login}</Text>
              <Text />
              <Hyperlink link={`mailto:${user.email}`}>{user.email}</Hyperlink>
              <Hyperlink link={user.websiteUrl}>{user.websiteUrl}</Hyperlink>
            </Content>
          </Partial>
          <Bio>{user.bio}</Bio>
          <PinnedRepositories pinnedRepositories={user.pinnedRepositories}/>
        </Container>
      </Layout>
    )
  }
}

export default User;
