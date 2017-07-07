export const getTitle = ({ actor, created_at, id, payload, repo, type }) => {
  let title, body;
  if(type === 'IssueCommentEvent') {
    const { action, comment, issue } = payload;
    if(action === 'created') {
      title = `${actor.login} commented at issue #${issue.number} on ${repo.name}`;
      body = comment.body;
    }
  } else if (type === 'IssuesEvent') {
    const { action, issue } = payload;
    if (action === 'opened') {
      title = `${actor.login} opened issue #${issue.number} on ${repo.name}`
      body = issue.title;
    } else if (action === 'closed') {
      title = `${actor.login} closed issue #${issue.number} on ${repo.name}`
    }
  } else if (type === 'PushEvent') {
    const { ref } = payload;
    title = `${actor.login} pushed to ${ref.split('/').splice(2).join('/')} branch at ${repo.name}`;
    body = `${payload.size} commits\n`
    body += payload.commits.map(i => i.message).join('\n')
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
