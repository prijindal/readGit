// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, FlatList, View, ToastAndroid } from 'react-native';
import moment from 'moment';

import Layout from '../../components/Layout';
import EventItem from '../../components/EventItem';
import ErrorText from '../../components/ErrorText';
import Loading from '../../components/Loading';

const styles = {
  scrollView: {
    paddingTop: 4,
    paddingBottom: 56,
  },
}

class NewsFeed extends Component {
  static propTypes = {
    user: PropTypes.shape({
      login: PropTypes.string,
      token: PropTypes.string,
    })
  }

  state = {
    data: [],
    last_updated: false,
    refreshing: true,
    loading: false,
    error: null,
    ended: false
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if(this.state.data.length < nextState.data.length) {
      return true;
    }
    else if (
      this.state.refreshing !== nextState.refreshing ||
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error
    ) {
      return true;
    }
    return false;
  }

  componentWillMount() {
    this.initData();
  }

  initData = async () => {
    this.setState({
      ended: false,
      refreshing: true,
    })
    try {
      let url = `https://api.github.com/users/${this.props.user.login}/received_events`
      console.log(url);
      let dataResponse = await fetch(url);
      let data = await dataResponse.json();
      this.setState({
        error: null,
        data,
        refreshing: false,
        last_updated: dataResponse.headers.map.date[0],
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

  updateData = async (): Promise<void> => {
    if(this.state.data.length === 0 || this.state.loading === true) return ;
    this.setState({
      loading: true
    })
    try {
      let url = `https://api.github.com/users/${this.props.user.login}/received_events?page=${((this.state.data.length / 30) + 1)}`;
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

  openPage = (routeInfo: any) => {
    this.props.navigation.dispatch(routeInfo);
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="News Feed"
        toolbarSubitle={this.lastUpdatedTime()}
      >
        {this.state.error !== null &&
          <ErrorText>{this.state.error}</ErrorText>
        }
          <FlatList
            maxToRenderPerBatch={50}
            updateCellsBatchingPeriod={1}
            contentContainerStyle={styles.scrollView}
            data={this.state.data}
            removeClippedSubviews
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <EventItem
                onPress={this.openPage}
                item={item}
              />
            )}
            ListFooterComponent={() => (
              <View>
                {this.state.error === null &&
                  <View>
                    {this.state.ended ?
                      <ErrorText>No more events</ErrorText>:
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

export default NewsFeed;
