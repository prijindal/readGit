// @flow
import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import Layout from '../components/Layout';
import Loading from '../components/Loading';

const styles = {
  image: {
    marginTop: 8,
    width: 300,
    height: 300,
  }
}

class User extends Component {
  state = {
    user: this.props.navigation.state.params.user
  }
  componentWillMount() {
    this.getUser();
  }

  getUser = async() => {
    let user = await fetch(this.state.user.url);
    user = await user.json();
    this.setState({
      user,
    });
  }

  render() {
    const { navigation } = this.props;
    const { user } = this.state;
    return (
      <Layout
        backButton
        onBackButtonPress={navigation.goBack}
        toolbarTitle={user.login}
      >
        <Text>{user.login}</Text>
        {user.avatar_url &&
          <Image source={{ uri: user.avatar_url }} style={styles.image} />
        }
      </Layout>
    )
  }
}

export default User;
