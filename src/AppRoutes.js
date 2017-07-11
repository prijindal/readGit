// @flow
import { StackNavigator } from 'react-navigation';

import LoginPage from './pages/Login';

import HomePage from './pages/Home';
import NotificationsPage from './pages/Notifications';
import UsersPage from './pages/Users';
import UserPage from './pages/User';

const AppRoutes = StackNavigator({
  Notifications: { screen: NotificationsPage },
  Home: { screen: HomePage },
  Users: { screen: UsersPage },
  Login: { screen: LoginPage },
  User: { screen: UserPage }
}, {
  headerMode: 'none',
});

export default AppRoutes;
