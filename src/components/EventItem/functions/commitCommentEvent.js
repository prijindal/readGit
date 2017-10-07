import React from 'react';
import { Text } from 'react-native';

const commitCommentEventInfo = event => {
  const { actor, payload, repo } = event;
  const { comment } = payload;
  console.log(payload);
  return {
    title: `${actor.login} commented on commit #${comment.commit_id.substr(0, 10)} at ${repo.name}`,
    body: <Text>{comment.body}</Text>,
  };
};

export default commitCommentEventInfo;
