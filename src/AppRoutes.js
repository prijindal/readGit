// @flow
import { StackNavigator } from 'react-navigation';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';

const AppRoutes = StackNavigator({
  Home: { screen: HomePage },
  Login: { screen: LoginPage }
}, {
  headerMode: 'none',
});

export default AppRoutes;
