// @flow
import { connect } from 'react-redux';
import { openDrawer } from '../../actions/drawer';

import Layout from './Layout';

export default connect(
  () => ({}),
  dispatch => ({
    openDrawer: () => dispatch(openDrawer()),
  })
)(Layout);
