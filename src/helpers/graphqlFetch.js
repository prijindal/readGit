export const HOST = 'https://api.github.com/graphql';

export const graphqlFetch = async ({query, variables, token}) => {
  let body = {
    query,
    variables
  }
  let options = {
    headers: {
      Authorization: 'Bearer ' + token
    },
    method: 'POST',
    body: JSON.stringify(body)
  }
  let resp = await fetch(HOST, options);
  return await resp.json();
}


export default graphqlFetch;
