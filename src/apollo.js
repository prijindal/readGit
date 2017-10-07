// @flow
import { ApolloClient, createNetworkInterface, IntrospectionFragmentMatcher } from 'react-apollo';

import apollofragment from './apollofragment.json';

const myFragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: apollofragment.data,
});

const networkInterface = createNetworkInterface({
  uri: 'https://api.github.com/graphql',
});

const client = new ApolloClient({
  networkInterface,
  fragmentMatcher: myFragmentMatcher,
});

export const installAuthentication = async (token: string) => {
  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        req.options.headers.Authorization = token ? `Bearer ${token}` : null;
        next();
      },
    },
  ]);
};

export default client;
