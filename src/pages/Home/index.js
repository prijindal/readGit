// @flow
import React, { Component } from 'react';
import { Text, FlatList, ScrollView, View } from 'react-native';
import moment from 'moment';

import Layout from '../../components/Layout';
import EventItem from '../../components/EventItem';
import Loading from '../../components/Loading';

const USER = 'prijindal';

const styles = {
  scrollView: {
    paddingTop: 4,
    paddingBottom: 56,
  }
}

class Home extends Component {
  componentWillMount() {
    this.initData();
  }

  initData = async () => {
    this.setState({
      refreshing: true,
    })
    let data = await fetch(`https://api.github.com/users/${USER}/received_events`);
    data = await data.json();
    this.setState({
      data,
      refreshing: false,
      last_updated: Date.now()
    });
  }

  updateData = async () => {
    if(this.state.data.length === 0 || this.state.loading === true) return ;
    this.setState({
      loading: true
    })
    let url = `https://api.github.com/users/${USER}/received_events?page=${((this.state.data.length / 30) + 1)}`;
    console.log(url);
    let newData = await fetch(url);
    newData = await newData.json();
    this.setState(prevState => ({
      data: [
        ...prevState.data,
        ...newData,
      ],
      refreshing: false,
      loading: (newData.length == undefined || newData.length < 30),
      ended: (newData.length == undefined || newData.length < 30),
    }));
  }

  state = {
    data: [],
    last_updated: false,
    refreshing: true,
    loading: false,
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="News Feed" //TODO: Add last updated at
        toolbarSubitle={this.state.last_updated ? `Last updated ${moment(this.state.last_updated).fromNow()}`: undefined}
      >
          <FlatList
            contentContainerStyle={styles.scrollView}
            data={this.state.data}
            removeClippedSubviews
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <EventItem
                item={item}
              />
            )}
            ListFooterComponent={() => (
              <View>
                {this.state.ended ?
                  <Text>No more events</Text>:
                  <Loading />
                }
              </View>
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
