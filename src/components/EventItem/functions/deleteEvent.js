const deleteEventInfo = event => {
  const { payload, repo } = event;
  const { ref_type, ref } = payload;
  return {
    title: `${repo.name} deleted ${ref} ${ref_type} on ${repo.name}`,
  };
};

export default deleteEventInfo;
