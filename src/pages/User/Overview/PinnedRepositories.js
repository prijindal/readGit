import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { gql } from 'react-apollo';
import { View, Text } from 'react-native';

import Loading from '../../../components/Loading';
import { textDarkDivider } from '../../../colors';
import Repository from '../../../components/Repository'
import SectionHeader from '../../../components/SectionHeader'

const Container = styled.View`
  border-top-width: 1;
  border-top-color: ${textDarkDivider.toString()};
`

class PinnedRepositories extends PureComponent {
  render() {
    const { pinnedRepositories } = this.props
    if (!pinnedRepositories || !pinnedRepositories.edges || pinnedRepositories.edges.length === 0) {
      return <View />
    }
    return (
      <Container>
        <SectionHeader title="Pinned Repositories" disabled/>
        {pinnedRepositories.edges.map(edge =>
          <Repository key={edge.node.id} repository={edge.node}/>
        )}
      </Container>
    )
  }
}

PinnedRepositories.fragment = gql`
fragment pinnedRepositoriesFragment on RepositoryConnection {
  edges {
    node {
      ...repositoryShortFragment
    }
  }
}
${Repository.shortFragment}
`

export default PinnedRepositories;
