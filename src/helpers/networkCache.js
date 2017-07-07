import { AsyncStorage } from 'react-native';

const NETWORK_KEY = 'NETWORK_REQUESTS_CACHE'

export const saveCache = async (request, text) => {
  let obj = {
    time: request.headers.map.date[0],
    body: await text,
  }
  return await AsyncStorage.setItem(NETWORK_KEY + ':' + request.url, JSON.stringify(obj));
}

export const getCache = async (url) => {
  let resp = await AsyncStorage.getItem(NETWORK_KEY + ':' + url);
  resp = JSON.parse(resp);
  return resp;
}
