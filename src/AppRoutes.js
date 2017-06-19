// @flow
import { StackNavigator } from 'react-navigation';

import LoginPage from './pages/Login';

import HomePage from './pages/Home';
import UserPage from './pages/User';

const AppRoutes = StackNavigator({
  Home: { screen: HomePage },
  Login: { screen: LoginPage },
  User: { screen: UserPage }
}, {
  headerMode: 'none',
});

export default AppRoutes;
