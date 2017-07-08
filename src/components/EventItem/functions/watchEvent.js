const watchEventInfo = ({ actor, created_at, id, payload, repo, type }) => ({
  title: `${actor.login} starred ${repo.name}`,
})

export default watchEventInfo;
