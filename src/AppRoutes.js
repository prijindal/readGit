// @flow
import { StackNavigator } from 'react-navigation';

import LoginPage from './pages/Login';

import HomePage from './pages/Home';
import UsersPage from './pages/Users';
import UserPage from './pages/User';

const AppRoutes = StackNavigator({
  Home: { screen: HomePage },
  Users: { screen: UsersPage },
  Login: { screen: LoginPage },
  User: { screen: UserPage }
}, {
  headerMode: 'none',
});

export default AppRoutes;
