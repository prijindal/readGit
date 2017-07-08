const forkEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { forkee } = payload;
  return {
    title: `${actor.login} forked ${repo.name} to ${forkee.full_name}`,
  }
}

export default forkEventInfo;
