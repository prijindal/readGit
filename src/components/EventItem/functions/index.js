import commitCommentEventInfo from './commitCommentEvent';
import createEventInfo from './createEvent';
import deleteEventInfo from './deleteEvent';
import forkEventInfo from './forkEvent';
import issueCommentEventInfo from './issueCommentEvent';
import issueEventInfo from './issueEvent';
import memberEventInfo from './memberEvent';
import pullRequestEventInfo from './pullRequestEvent';
import pullRequestReviewCommentEventInfo from './pullRequestReviewCommentEvent';
import publicEventInfo from './publicEvent';
import pushEventInfo from './pushEvent';
import watchEventInfo from './watchEvent';

const getInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  if(type === 'CommitCommentEvent') {
    return commitCommentEventInfo(event);
  } else if(type === 'CreateEvent') {
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

export default getInfo;
