import React from 'react';
import { Text, View } from 'react-native';

const createEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { ref_type, ref, master_branch, description, pusher_type } = payload;
  if(ref_type === 'repository') {
    return {
      title: `${actor.login} created repository ${repo.name}`
    }
  } else {
    return {
      title: `${actor.login} created ${ref} ${ref_type} on ${repo.name}`
    }
  }
}

const deleteEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { ref_type, ref } = payload;
  return {
    title: `${repo.name} deleted ${ref} ${ref_type} on ${repo.name}`,
  }
}

const forkEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { forkee } = payload;
  return {
    title: `${actor.login} forked ${repo.name} to ${forkee.full_name}`,
  }
}

const issueCommentEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { action, comment, issue } = payload;
  if(action === 'created') {
    return {
      title: `${actor.login} commented at issue #${issue.number} on ${repo.name}`,
      body: <Text>{comment.body}</Text>,
    }
  } else {
    console.error(payload);
  }
}

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

const memberEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { member, action } = payload;
  if (action === 'added') {
    return {
      title: `${actor.login} added ${member.login} to ${repo.name}`
    }
  } else {
    console.error(payload)
  }
}

const pullRequestEventInfo = event => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { action, number, pull_request } = payload;
  if (action === 'opened') {
    return {
      title: `${actor.login} opened pull request #${number} on ${repo.name}`,
      body: <Text>{pull_request.title} {'\n'}
              {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
            </Text>
    }
  }
  else if (action === 'closed') {
    if (pull_request.merged) {
      return {
        title: `${actor.login} merged pull request #${number} on ${repo.name}`,
        body: <Text>{pull_request.title} {'\n'}
              {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
            </Text>
      }
    } else {
      return {
        title: `${actor.login} closed pull request #${number} on ${repo.name}`,
        body: <Text>{pull_request.title} {'\n'}
              {`${pull_request.commits} Commits with ${pull_request.additions} additions and ${pull_request.deletions} deletions`}
            </Text>
      }
    }
  } else {
    console.error(payload);
  }
}

const pullRequestReviewCommentEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { action, changes, pull_request, comment } = payload;
  if (action === 'created') {
    return {
      title: `${actor.login} commented on pull request #${pull_request.number} at ${repo.name}`,
      body: <Text>{comment.body}</Text>
    }
  } else {
    console.error(payload)
  }
}

const publicEventInfo = ({ actor, created_at, id, payload, repo, type }) => ({
  title: `${actor.login} made ${repo.name} public`,
})

const pushEventInfo = ({ actor, created_at, id, payload, repo, type }) => {
  const { ref } = payload;
  return {
    title: `${actor.login} pushed to ${ref.split('/').splice(2).join('/')} at ${repo.name}`,
    body: <Text>
          {`${payload.size} commits\n` +
            payload.commits.map(i => i.message).join('\n')}
        </Text>,
  }
}

const watchEventInfo = ({ actor, created_at, id, payload, repo, type }) => ({
  title: `${actor.login} starred ${repo.name}`,
})

export const getInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  if(type === 'CreateEvent') {
    return createEventInfo(event);
  } else if(type === 'DeleteEvent') {
    return deleteEventInfo(event);
  } else if(type === 'ForkEvent') {
    return forkEventInfo(event);
  } else if(type === 'IssueCommentEvent') {
    return issueCommentEventInfo(event);
  } else if (type === 'IssuesEvent') {
    return issueEventInfo(event);
  } else if (type === 'MemberEvent') {
    return memberEventInfo(event);
  } else if (type === 'PullRequestEvent') {
    return pullRequestEventInfo(event);
  } else if (type === 'PullRequestReviewCommentEvent') {
    return pullRequestReviewCommentEventInfo(event);
  } else if (type === 'PublicEvent') {
    return publicEventInfo(event);
  } else if (type === 'PushEvent') {
    return pushEventInfo(event);
  } else if (type === 'WatchEvent') {
    return watchEventInfo(event);
  } else {
    console.error(type)
    return {
      title: type,
    }
  }
}
