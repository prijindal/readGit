import React from 'react';
import { Text } from 'react-native';

const pullRequestReviewCommentEventInfo = event => {
  const { actor, payload, repo } = event;
  const { action, pull_request, comment } = payload;
  if (action === 'created') {
    return {
      title: `${actor.login} commented on pull request #${pull_request.number} at ${repo.name}`,
      body: <Text>{comment.body}</Text>,
    };
  } else {
    console.error(payload);
  }
};

export default pullRequestReviewCommentEventInfo;
