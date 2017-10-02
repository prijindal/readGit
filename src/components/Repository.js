// @flow
import React, { PureComponent } from 'react';
import moment from 'moment';
import { gql } from 'react-apollo';
import Icon from '@expo/vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { View, TouchableNativeFeedback, Linking } from 'react-native';

import { Container, Content, Title, Text } from './ListItem';
import { textDarkPrimary, textDarkDivider, textSecondary } from '../colors';

const StargazersView = styled.View`
  flex-direction: row;
  align-items: center;
`

const Round = styled.View`
  width: 12;
  margin-horizontal: 4;
  height: 12;
  border-radius: 10;
  background-color: ${textDarkPrimary.toString()};
`

const styles = {
  container: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: textDarkDivider,
    backgroundColor: textSecondary
  },
  mainContent: {
    maxWidth: null
  },
  additionalContent: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  starIcon: {
    marginHorizontal: 4
  }
}

const Stargazers = ({ stargazers }) => (
  <StargazersView>
    <Icon name="star" size={16} color={textDarkPrimary.toString()} style={styles.starIcon}/>
    <Text>{stargazers}</Text>
  </StargazersView>
)

const Language = ({language}) => (
  <StargazersView>
    <Round style={{backgroundColor: language.color}}/>
    <Text>{language.name}</Text>
  </StargazersView>
)

class Repository extends PureComponent {
  onPress = () => {
    const { repository } = this.props
    Linking.openURL(repository.url);
  }

  render() {
    const { repository } = this.props
    return (
      <TouchableNativeFeedback onPress={this.onPress}>
        <View style={styles.container}>
          <Content style={styles.mainContent}>
            <Title>{`${repository.owner.login}/${repository.name}`}</Title>
            <Text>{repository.description}</Text>
            {repository.pushedAt !== undefined &&
              <View style={styles.additionalContent}>
                <Text></Text>
                <Text>{'Updated ' + moment(repository.pushedAt).fromNow()}</Text>
              </View>
            }
          </Content>
          {(repository.languages !== undefined && repository.stargazers !== undefined) &&
            <Content style={styles.additionalContent}>
              {repository.languages !== undefined &&
                <View>
                  {repository.languages.edges.map(edge => (
                    <Language key={edge.node.id} language={edge.node}/>
                  ))}
                </View>
              }
              {repository.stargazers !== undefined &&
                <Stargazers stargazers={repository.stargazers.totalCount}/>
              }
            </Content>
          }
        </View>
      </TouchableNativeFeedback>
    )
  }
}

Repository.shortFragment = gql`
  fragment repositoryShortFragment on Repository {
    id
    name
    owner {
      login
    }
    url
    description
  }
`

Repository.fragment = gql`
  fragment repositoryFragment on Repository {
    ...repositoryShortFragment
    stargazers {
      totalCount
    }
    languages(first: 1) {
      edges {
        node {
          id
          color
          name
        }
      }
    }
    pushedAt
  }
  ${Repository.shortFragment}
`

export default Repository;
