import React from 'react';
import { Text, View } from 'react-native';

export const getInfo = ({ actor, created_at, id, payload, repo, type }) => {
  let title, body;
  if(type === 'CreateEvent') {
    const { ref_type, ref, master_branch, description, pusher_type } = payload;
    if(ref_type === 'repository') {
      title = `${actor.login} created repository ${repo.name}`
    } else {
      console.error(payload)
    }
  } else if(type === 'ForkEvent') {
    const { forkee } = payload;
    title = `${actor.login} forked ${repo.name} to ${forkee.full_name}`;
  } else if(type === 'IssueCommentEvent') {
    const { action, comment, issue } = payload;
    if(action === 'created') {
      title = `${actor.login} commented at issue #${issue.number} on ${repo.name}`;
      body = <Text>{comment.body}</Text>;
    } else {
      console.error(payload);
    }
  } else if (type === 'IssuesEvent') {
    const { action, issue } = payload;
    if (action === 'opened') {
      title = `${actor.login} opened issue #${issue.number} on ${repo.name}`
      body = <Text>{issue.title}</Text>;
    } else if (action === 'closed') {
      title = `${actor.login} closed issue #${issue.number} on ${repo.name}`
    } else {
      console.error(payload);
    }
  } else if (type === 'MemberEvent') {
    const { member, action } = payload;
    if (action === 'added') {
      title = `${actor.login} added ${member.login} to ${repo.name}`      
    } else {
      console.error(payload)
    }
  } else if (type === 'PullRequestEvent') {
    const { action, number, pull_request } = payload;
    if (action === 'opened') {
      title = `${actor.login} opened pull request #${number} on ${repo.name}`;
      body = <Text>{pull_request.title} {'\n'}
              {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
            </Text>
    }
    else if (action === 'closed') {
      if (pull_request.merged) {
        title = `${actor.login} merged pull request #${number} on ${repo.name}`;
        body = <Text>{pull_request.title} {'\n'}
                {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
              </Text>
      } else {
        title = `${actor.login} closed pull request #${number} on ${repo.name}`;
        body = <Text>{pull_request.title} {'\n'}
                {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
              </Text>
      }
    } else {
      console.error(payload);
    }
  } else if (type === 'PublicEvent') {
    title = `${actor.login} made ${repo.name} public`;
  } else if (type === 'PushEvent') {
    const { ref } = payload;
    title = `${actor.login} pushed to ${ref.split('/').splice(2).join('/')} at ${repo.name}`;
    body = <Text>
            {`${payload.size} commits\n` +
              payload.commits.map(i => i.message).join('\n')}
          </Text>;
  } else if (type === 'WatchEvent') {
    title = `${actor.login} starred ${repo.name}`;
  } else {
    console.error(type)
    title = type;
  }
  return {
    title,
    body
  };
}
