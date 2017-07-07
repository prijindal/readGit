import React from 'react';
import { Text, View } from 'react-native';

export const getInfo = ({ actor, created_at, id, payload, repo, type }) => {
  let title, body;
  if(type === 'IssueCommentEvent') {
    const { action, comment, issue } = payload;
    if(action === 'created') {
      title = `${actor.login} commented at issue #${issue.number} on ${repo.name}`;
      body = <Text>{comment.body}</Text>;
    }
  } else if (type === 'IssuesEvent') {
    const { action, issue } = payload;
    if (action === 'opened') {
      title = `${actor.login} opened issue #${issue.number} on ${repo.name}`
      body = <Text>{issue.title}</Text>;
    } else if (action === 'closed') {
      title = `${actor.login} closed issue #${issue.number} on ${repo.name}`
    }
  } else if (type === 'PushEvent') {
    const { ref } = payload;
    title = `${actor.login} pushed to ${ref.split('/').splice(2).join('/')} branch at ${repo.name}`;
    body = <Text>
            {`${payload.size} commits\n` +
              payload.commits.map(i => i.message).join('\n')}
          </Text>;
  } else if (type === 'WatchEvent') {
    title = `${actor.login} starred ${repo.name}`;
  } else {
    title = type;
  }
  return {
    title,
    body
  };
}
