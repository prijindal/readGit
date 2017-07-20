export const HOST = 'https://api.github.com';

export const restFetch = async (url,token, options={ headers: {} }) => {
  if (url.indexOf(HOST) === -1) {
    url = HOST + url; // TODO: Better url merge
  }
  const initHeaders = options.headers;
  delete options.headers;
  options = {
    method: 'GET',
    headers: {
      Authorization: 'token ' + token,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...initHeaders,
    },
    ...options,
  }
  return await fetch(url, options);
}


export default restFetch;
