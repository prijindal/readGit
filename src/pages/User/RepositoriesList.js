// @flow
import React, { PureComponent } from 'react';
import { Text, FlatList } from 'react-native';
import { gql } from 'react-apollo';

import Loading from '../../components/Loading';
import Repository from '../../components/Repository';

class RepositoriesList extends PureComponent {
  render() {
    const { data } = this.props;
    if (data.loading) {
      return <Loading />;
    }
    if (data.error) {
      return <Text>{data.error.message}</Text>;
    }
    if (!data.repositoryOwner || !data.repositoryOwner.repositories.edges || data.repositoryOwner.repositories.edges.length === 0) {
      return <Text>No Results Found</Text>;
    }
    return (
      <FlatList
        data={data.repositoryOwner.repositories.edges}
        keyExtractor={item => item.node.id}
        renderItem={({ item }) => <Repository repository={item.node} />}
      />
    );
  }
}

RepositoriesList.fragment = gql`
fragment repositoriesListFragment on RepositoryConnection {
  edges {
    node {
      ...repositoryFragment
    }
  }
}
${Repository.fragment}
`;

export default RepositoriesList;
