// @flow
import { connect } from 'react-redux';
import Home from './Home';

export default connect(
  ({ user }) => ({ user })
)(Home);
