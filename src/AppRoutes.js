// @flow
import { StackNavigator } from 'react-navigation';

import HomePage from './pages/Home';

const AppRoutes = StackNavigator({
  Home: { screen: HomePage },
}, {
  headerMode: 'none',
});

export default AppRoutes;
