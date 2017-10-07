const forkEventInfo = event => {
  const { actor, payload, repo } = event;
  const { forkee } = payload;
  return {
    title: `${actor.login} forked ${repo.name} to ${forkee.full_name}`,
  };
};

export default forkEventInfo;
