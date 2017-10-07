import React from 'react';
import { Text, View } from 'react-native';

import Avatar from '../../Avatar';
import { textDarkPrimary } from '../../../colors';

const styles = {
  container: {
    flexDirection: 'row',
    marginRight: 16,
    maxWidth: 300,
  },
  avatar: {
    marginVertical: 8,
  },
  commits: {
    color: textDarkPrimary,
  },
  textContainer: {
    marginHorizontal: 8,
  },
};

const pushEventInfo = ({ actor, created_at, id, payload, repo, type }) => {
  const { ref } = payload;
  return {
    title: `${actor.login} pushed to ${ref
      .split('/')
      .splice(2)
      .join('/')} at ${repo.name}`,
    body: (
      <View style={styles.container}>
        <Avatar url={actor.avatar_url} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.commits}>{`${payload.size} commits`}</Text>
          {payload.commits.map(i => <Text key={i.sha}>{i.message}</Text>)}
        </View>
      </View>
    ),
  };
};

export default pushEventInfo;
