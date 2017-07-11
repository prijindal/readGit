import { TOKEN } from '../tokens';

export const HOST = 'https://api.github.com';

export const restFetch = async (url, method='GET', initHeaders={}) => {
  url = HOST + url; // TODO: Better url merge
  let headers = {
    Authorization: 'token ' + TOKEN,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...initHeaders,
  }
  let options = {
    method,
    headers
  }
  return await fetch(url, options);
}


export default restFetch;
