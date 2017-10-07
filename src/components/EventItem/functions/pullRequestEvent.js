import React from 'react';
import { Text } from 'react-native';

const pullRequestEventInfo = event => {
  const { actor, payload, repo } = event;
  const { action, number, pull_request } = payload;
  if (action === 'opened') {
    return {
      title: `${actor.login} opened pull request #${number} on ${repo.name}`,
      body: (
        <Text>
          {pull_request.title} {'\n'}
          {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
        </Text>
      ),
    };
  } else if (action === 'closed') {
    if (pull_request.merged) {
      return {
        title: `${actor.login} merged pull request #${number} on ${repo.name}`,
        body: (
          <Text>
            {pull_request.title} {'\n'}
            {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
          </Text>
        ),
      };
    } else {
      return {
        title: `${actor.login} closed pull request #${number} on ${repo.name}`,
        body: (
          <Text>
            {pull_request.title} {'\n'}
            {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
          </Text>
        ),
      };
    }
  } else {
    console.error(payload);
  }
};

export default pullRequestEventInfo;
