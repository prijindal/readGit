// @flow
import { connect } from 'react-redux';
import NewsFeed from './NewsFeed';

export default connect(
  ({ user }) => ({ user })
)(NewsFeed);
