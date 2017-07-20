// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, SectionList, FlatList, ScrollView, View, ToastAndroid } from 'react-native';
import moment from 'moment';

import { textDarkSecondary } from '../../colors';
import fetch, { HOST } from '../../helpers/restFetch';

import Layout from '../../components/Layout';
import ListItem from '../../components/ListItem';
import SectionHeader from '../../components/SectionHeader';
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

  state = {
    sections: [],
    last_updated: false,
    refreshing: true,
    loading: false,
    error: null,
  }

  componentWillMount() {
    this.initData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.sections.length < nextState.sections.length) {
      return true;
    }
    for (var i = 0; i < this.state.sections.length; i++) {
      if (this.state.sections[i].data.length < nextState.sections[i].data.length) {
        return true;
      }
    }
    if (
      this.state.refreshing !== nextState.refreshing ||
      this.state.loading !== nextState.loading ||
      this.state.error !== nextState.error
    ) {
      return true;
    }
    return false;
  }

  initData = async () => {
    this.setState({
      refreshing: true,
      ended: false,
      loading: true,
    })
    try {
      let url = '/notifications?all=true&page=1'
      console.log(url);
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
      { title: 'Today', data:[] },
      { title: 'This week', data:[] },
      { title: 'This month', data:[] },
      { title: 'This year', data:[] },
      { title: 'Older', data:[] },
    ]
    let now = moment();
    data.forEach(notification => {
      let time = moment(notification.updated_at);
      let index = sections.length - 1;
      if (time.year() === now.year()) {
        index--;
      }
      if (time.month() === now.month()) {
        index--;
      }
      if (time.isoWeek() === now.isoWeek()) {
        index--;
      }
      if (time.date() === now.date()) {
        index--;
      }
      sections[index].data.push(notification);
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

  onActionSelected = (pos) => {
    if (pos === 0) {
      alert('Position 0');
    }
  }

  render() {
    return (
      <Layout
        menuEnabled
        toolbarTitle="Notifications"
        actions={[{
          title: 'Group by',
          show: 'always',
          iconName: 'filter-list'
        }]}
        onActionSelected={this.onActionSelected}
        toolbarSubitle={this.lastUpdatedTime()}
      >
        {this.state.error !== null &&
          <Text style={styles.error}>{this.state.error}</Text>
        }
          <SectionList
            maxToRenderPerBatch={50}
            updateCellsBatchingPeriod={1}
            contentContainerStyle={styles.scrollView}
            sections={this.state.sections}
            removeClippedSubviews
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <ListItem
                onPress={this.openPage}
                item={{title: item.repository.full_name, body: item.subject.title, date: item.updated_at}}
                disabled={!item.unread}
              />
            )}
            renderSectionHeader={({section}) =>
              <View>
                {section.data.length > 0 &&
                  <SectionHeader title={section.title}/>
                }
              </View>
            }
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
