import { NavigationActions } from 'react-navigation';

const createEventInfo = (event) => {
  const { actor, created_at, id, payload, repo, type } = event;
  const { ref_type, ref, master_branch, description, pusher_type } = payload;
  if(ref_type === 'repository') {
    return {
      title: `${actor.login} created repository ${repo.name}`,
      link: NavigationActions.navigate({ routeName: 'Repository', params: { repo: repo } })
    }
  } else {
    return {
      title: `${actor.login} created ${ref} ${ref_type} on ${repo.name}`,
    }
  }
}

export default createEventInfo;
