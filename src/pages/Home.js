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
    let data = Array(10).fill().map((_, i) => ({key: i.toString(), title : (i * i).toString()}));
    this.setState({
      data,
      refreshing: false,
    });
  }

  updateData = () => {
    let data = Array(this.state.data.length + 10).fill().map((_, i) => ({key: i.toString(), title : (i * i).toString()}));
    this.setState({
      data,
    });
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
            renderItem={({item}) => <ListItem item={item}/>}
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
