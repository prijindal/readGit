// @flow
import { connect } from 'react-redux';
import Header from './Header';
import { addSetting, removeSetting } from '../../../actions/settings';

export default connect(
  ({ settings }) => ({ grouprepo: settings.grouprepo }),
  dispatch => ({
    addGroupRepo: () => dispatch(addSetting('grouprepo', true)),
    removeGroupRepo: () => dispatch(removeSetting('grouprepo')),
  })
)(Header)
