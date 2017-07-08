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


export default memberEventInfo;
