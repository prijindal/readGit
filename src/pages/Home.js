// @flow
import React, { Component } from 'react';
import { Text, FlatList, View, ScrollView, ActivityIndicator } from 'react-native';

import { primary } from '../colors';
import sleep from '../helpers/sleep';

import Layout from '../components/Layout';
import ListItem from '../components/ListItem';

const styles = {
  scrollView: {
    paddingBottom: 56,
  },
  loading: {
    paddingVertical: 12,
  }
}

const Loading = () => (
  <View style={styles.loading}>
    <ActivityIndicator color={primary} size={24}/>
  </View>
)

class Home extends Component {
  componentWillMount() {
    this.initData();
  }

  initData = async () => {
    this.setState({
      refreshing: true,
    })
    await sleep(1000);
    let data = await fetch('https://api.github.com/users');
    data = await data.json();
    this.setState({
      data,
      refreshing: false,
    });
  }

  updateData = async () => {
    let newData = await fetch(`https://api.github.com/users?since=${this.state.data[this.state.data.length - 1].id}`);
    newData = await newData.json();
    this.setState(prevState => ({
      data: [
        ...prevState.data,
        ...newData,
      ],
      refreshing: false,
    }));
  }

  state = {
    data: [],
    refreshing: true,
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="Home"
      >
          <FlatList
            contentContainerStyle={styles.scrollView}
            data={this.state.data}
            removeClippedSubviews
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <ListItem item={{title: item.login, image: item.avatar_url}}/>}
            ListFooterComponent={() => (
              <Loading />
            )}
            refreshing={this.state.refreshing}
            onRefresh={this.initData}
            onEndReached={this.updateData}
          />
      </Layout>
    )
  }
}

export default Home;
