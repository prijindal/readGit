// @flow
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Linking, TouchableNativeFeedback } from 'react-native';

import Loading from '../../../components/Loading';

import {
  textDarkPrimary,
  textDarkSecondary,
  textDarkDivider,
  white,
  textPrimary,
  textSecondary,
} from '../../../colors';

import PinnedRepositories from './PinnedRepositories';

const Image = styled.Image`
  margin-top: 8;
  width: 120;
  height: 120;
`

const ImageLoading = styled.View`
  margin-top: 8;
  justify-content: center;
  align-items: center;
  width: 120;
  height: 120;
`

const Container = styled.View`
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

class Overview extends Component {
  render() {
    const { data } = this.props
    let { user } = this.props.screenProps.navigation.state.params;
    if (!data.loading && !data.error) {
      user = data.repositoryOwner
    }
    return (
      <ScrollView>
        <Container>
          <Partial>
            {data.loading ?
              <ImageLoading>
                <Loading />
              </ImageLoading> :
              <Image source={{ uri: user.avatarUrl }}/>
            }
            <Content>
              <Title>{user.name}</Title>
              <Text>{user.login}</Text>
              <Text />
              <Hyperlink link={`mailto:${user.email}`}>{user.email}</Hyperlink>
              <Hyperlink link={user.websiteUrl}>{user.websiteUrl}</Hyperlink>
            </Content>
          </Partial>
          <Bio>{user.bio}</Bio>
        </Container>
        <PinnedRepositories pinnedRepositories={user.pinnedRepositories}/>
      </ScrollView>
    )
  }
}

export default Overview;
