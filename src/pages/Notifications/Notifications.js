// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, SectionList, ScrollView, View, ToastAndroid } from 'react-native';
import moment from 'moment';

import { saveCache, getCache } from '../../helpers/networkCache';
import { textDarkSecondary } from '../../colors';
import fetch, { HOST } from '../../helpers/restFetch';

import Layout from '../../components/Layout';
import ListItem from '../../components/ListItem';
import Loading from '../../components/Loading';

const USER = 'mdo';

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

class Notifications extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      token: PropTypes.string,
    })
  }

  componentWillMount() {
    this.init();
  }

  init = async () => {
    this.setState({
      refreshing: true,
    })
    try {
      let { time, body } = await getCache(HOST + '/notifications?all=true&page=1');
      body = JSON.parse(body);
      console.log(body);
      this.setState({
        error: null,
        sections: this.dataToSections(body),
        refreshing: false,
        last_updated: time,
      })
    } catch(e) {
      console.log(e);
    } finally {
      this.initData();
    }
  }

  initData = async () => {
    this.setState({
      ended: false,
      loading: true,
    })
    try {
      let url = '/notifications?all=true&page=1'
      let dataResponse = await fetch(url);
      data = await dataResponse.json();
      this.setState({
        error: null,
        sections: this.dataToSections(data),
        refreshing: false,
        loading: false,
        page: 1,
        last_updated: dataResponse.headers.map.date[0],
      });
      await saveCache(dataResponse, JSON.stringify(data));
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
    if(this.state.sections.length === 0 || this.state.loading === true) return ;
    this.setState({
      loading: true
    })
    let prevData = this.sectionToData(this.state.sections);
    try {
      let url = `/notifications?all=true&page=${this.state.page + 1}`;
      console.log(url);
      let newData = await fetch(url);
      newData = await newData.json();
      let completeData = [
        ...prevData,
        ...newData,
      ]
      this.setState(prevState => ({
        sections: this.dataToSections(completeData),
        refreshing: false,
        page: prevState.page + 1,
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

  dataToSections = (data) => {
    const sections = [
      { title: 'Today', to: 24*3600*1000, data:[] },
      { title: 'Yesterday', to: 2*24*3600*1000, data:[] },
      { title: 'Last 3 Days', to: 3*24*3600*1000, data:[] },
      { title: 'This week', to: 7*24*3600*1000, data:[] },
      { title: 'This month', to: 30*24*3600*1000, data:[] },
      { title: 'This year', to: 365*24*3600*1000, data:[] },
    ]
    data.forEach(notification => {
      let time = moment(notification.updated_at);
      let diff = (Date.now() - time);
      for(var i = 1;i < sections.length;i++) {
        if((sections[i - 1].to < diff) && (diff < sections[i].to)) {
          sections[i].data.push(notification)
          return;
        }
      }
      sections[0].data.push(notification)
    })
    return sections;
  }

  sectionToData = (sections) => {
    let data = []
    sections.forEach(i => {
      data = [
        ...data,
        ...i.data
      ]
    })
    return data
  }

  lastUpdatedTime = () => {
    if(!this.state.last_updated) return undefined;
    let moment_last_updated = moment(this.state.last_updated);
    if(moment_last_updated.diff(moment(), 'days') > 1) {
      return `Last updated ${moment_last_updated.calendar()}`;
    }
    return `Last updated ${moment_last_updated.fromNow()}`;
  }

  openPage = (routeInfo) => {
    this.props.navigation.dispatch(routeInfo);
  }

  state = {
    sections: [],
    last_updated: false,
    refreshing: true,
    loading: false,
    error: null,
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="Notifications"
        toolbarSubitle={this.lastUpdatedTime()}
      >
        {this.state.error !== null &&
          <Text style={styles.error}>{this.state.error}</Text>
        }
          <SectionList
            contentContainerStyle={styles.scrollView}
            sections={this.state.sections}
            removeClippedSubviews
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <ListItem
                onPress={this.openPage}
                item={{title: item.repository.full_name, body: item.subject.title, additional: moment(item.updated_at).fromNow()}}
                disabled={!item.unread}
              />
            )}
            renderSectionHeader={({section}) => <Text>{section.title}</Text>}
            ListFooterComponent={() => (
              <View>
                {this.state.error === null &&
                  <View>
                    {this.state.ended ?
                      <Text style={styles.error}>No more notifications</Text>:
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

export default Notifications;
