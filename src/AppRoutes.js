// @flow
import { StackNavigator } from 'react-navigation';

import LoginPage from './pages/Login';

import NewsFeedPage from './pages/NewsFeed';
import NotificationsPage from './pages/Notifications';
import UsersPage from './pages/Users';
import UserPage from './pages/User';
import SearchPage from './pages/Search';

const AppRoutes = StackNavigator({
  Search: { screen: SearchPage },
  Home: { screen: NotificationsPage },
  NewsFeed: { screen: NewsFeedPage },
  Users: { screen: UsersPage },
  Login: { screen: LoginPage },
  User: { screen: UserPage },
}, {
  navigationOptions: {
    header: null
  }
});

export default AppRoutes;
