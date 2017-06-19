// @flow
import React from 'react';
import { Text } from 'react-native';

import Layout from '../components/Layout';

const Home = () => (
  <Layout
    menuEnabled
    toolbarTitle="Home"
  >
    <Text>Home Screen</Text>
  </Layout>
)

export default Home;
