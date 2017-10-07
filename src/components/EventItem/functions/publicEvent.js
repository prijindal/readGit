const publicEventInfo = ({ actor, created_at, id, payload, repo, type }) => ({
  title: `${actor.login} made ${repo.name} public`,
});

export default publicEventInfo;
