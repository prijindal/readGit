// @flow
import React, { Component } from 'react';
import { Text, FlatList, ScrollView, View, ToastAndroid } from 'react-native';
import moment from 'moment';

import { textDarkSecondary } from '../../colors';

import Layout from '../../components/Layout';
import EventItem from '../../components/EventItem';
import Loading from '../../components/Loading';

const USER = 'prijindal';

const styles = {
  scrollView: {
    paddingTop: 4,
    paddingBottom: 56,
  },
  error: {
    padding: 8,
    color: textDarkSecondary,
    textAlign: 'center'
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
    try {
      let data = await fetch(`https://api.github.com/users/${USER}/received_events`);
      data = await data.json();
      this.setState({
        error: null,
        data,
        refreshing: false,
        last_updated: Date.now()
      });
    } catch(e) {
      ToastAndroid.show(e.message, ToastAndroid.LONG);
      this.setState({
        error: e.message,
        refreshing: false,
        ended: true,
      })
    }
  }

  updateData = async () => {
    if(this.state.data.length === 0 || this.state.loading === true) return ;
    this.setState({
      loading: true
    })
    try {
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
    } catch(e) {
      ToastAndroid.show(e.message, ToastAndroid.LONG);
      this.setState({
        loading: false,
      })
    }
  }

  lastUpdatedTime = () => {
    if(!this.state.last_updated) return undefined;
    let moment_last_updated = moment(this.state.last_updated);
    if(moment_last_updated.diff(moment(), 'days') > 1) {
      return `Last updated ${moment_last_updated.calendar()}`;
    }
    return `Last updated ${moment_last_updated.fromNow()}`;
  }

  state = {
    data: [],
    last_updated: false,
    refreshing: true,
    loading: false,
    error: null,
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="News Feed" //TODO: Add last updated at
        toolbarSubitle={this.lastUpdatedTime()}
      >
        {this.state.error !== null &&
          <Text style={styles.error}>{this.state.error}</Text>
        }
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
                {this.state.error === null &&
                  <View>
                    {this.state.ended ?
                      <Text style={styles.error}>No more events</Text>:
                      <Loading />
                    }
                  </View>
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
