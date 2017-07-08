const deleteEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { ref_type, ref } = payload;
  return {
    title: `${repo.name} deleted ${ref} ${ref_type} on ${repo.name}`,
  }
}

export default deleteEventInfo;
