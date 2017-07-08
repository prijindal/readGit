import React from 'react';
import { Text } from 'react-native';

const issueEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { action, issue } = payload;
  if (action === 'opened') {
    return {
      title: `${actor.login} opened issue #${issue.number} on ${repo.name}`,
      body: <Text>{issue.title}</Text>
    }
  } else if (action === 'closed') {
    return {
      title: `${actor.login} closed issue #${issue.number} on ${repo.name}`
    }
  } else {
    console.error(payload);
  }
}

export default issueEventInfo;
