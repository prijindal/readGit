import { NavigationActions } from 'react-navigation';

const createEventInfo = event => {
  const { actor, payload, repo } = event;
  const { ref_type, ref } = payload;
  if (ref_type === 'repository') {
    return {
      title: `${actor.login} created repository ${repo.name}`,
      link: NavigationActions.navigate({ routeName: 'Repository', params: { repo } }),
    };
  } else {
    return {
      title: `${actor.login} created ${ref} ${ref_type} on ${repo.name}`,
    };
  }
};

export default createEventInfo;
