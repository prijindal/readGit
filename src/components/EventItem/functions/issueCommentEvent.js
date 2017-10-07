import React from 'react';
import { Text } from 'react-native';

const issueCommentEventInfo = event => {
  const { actor, payload, repo } = event;
  const { action, comment, issue } = payload;
  if (action === 'created') {
    return {
      title: `${actor.login} commented at issue #${issue.number} on ${repo.name}`,
      body: <Text>{comment.body}</Text>,
    };
  } else {
    console.error(payload);
  }
};

export default issueCommentEventInfo;
