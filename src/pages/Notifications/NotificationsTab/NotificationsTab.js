import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, SectionList, View, Alert, Linking, ScrollView } from 'react-native';
import moment from 'moment';

import { textDarkSecondary, textPrimary, textSecondary, textDivider } from '../../../colors';
import fetch from '../../../helpers/restFetch';

import ListItem from '../../../components/ListItem';
import SectionHeader from '../../../components/SectionHeader';
import Loading from '../../../components/Loading';

const styles = {
  scrollView: {
    paddingTop: 4,
  },
  error: {
    padding: 8,
    color: textDarkSecondary,
    textAlign: 'center'
  }
}

export default class NotificationsTab extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      token: PropTypes.string,
    })
  }

  static defaultProps = {
    grouprepo: false
  }

  state = {
    sections: [],
    refreshing: true,
    loading: false,
    error: null,
  }

  componentWillMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.grouprepo !== nextProps.grouprepo) {
      this.initData();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.grouprepo !== nextProps.grouprepo) {
      return true;
    }
    if(this.state.sections.length !== nextState.sections.length) {
      return true;
    }
    for (var i = 0; i < this.state.sections.length; i++) {
      if (this.state.sections[i].data.length !== nextState.sections[i].data.length) {
        return true;
      }
    }
    if (
      this.state.refreshing !== nextState.refreshing ||
      this.state.loading !== nextState.loading ||
      this.props.unread !== nextState.props ||
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
      let url = `/notifications?all=${!this.props.unread}&participating=${this.props.participating}&page=1`
      console.log(url);
      let dataResponse = await fetch(url, this.props.token);
      data = await dataResponse.json();
      this.setState({
        error: null,
        sections: this.dataToSections(data),
        ended: (data.length == undefined || data.length < 30),
        refreshing: false,
        loading: false,
        page: 1,
      });
    } catch(e) {
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
      let url = `/notifications?all=${!this.props.unread}&participating=${this.props.participating}&page=${this.state.page + 1}`;
      console.log(url);
      let newData = await fetch(url, this.props.token);
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
      this.setState({
        loading: false,
      })
    }
  }

  dataToSections = (data) => {
    if (this.props.grouprepo) {
      return this.groupByRepo(data);
    }
    return this.groupByDate(data);
  }

  groupByRepo = (data) => {
    const sections = [];
    data.forEach(notification => {
      let name = notification.repository.full_name
      for (var i = 0; i < sections.length; i++) {
        if(sections[i].title === name) {
          sections[i].data.push(notification)
          return;
        }
      }
      sections.push({
        title: name,
        data: [notification]
      })
    })
    return sections
  }

  groupByDate = (data) => {
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

  openPage = async (notification) => {
    const {subject, id, unread} = notification;
    let url = 'https://github.com';
    if (subject.type === 'Issue') {
      url = [url, subject.url.split('/').slice(4).join('/')].join('/')
    } else if (subject.type === 'PullRequest') {
      let splitedUrl = subject.url.split('/').slice(4)
      splitedUrl[2] = 'pull'
      url = [url, splitedUrl.join('/')].join('/')
    } else {
      console.log(subject);
    }
    let latest_comment_url = subject.latest_comment_url
    if (latest_comment_url) {
      latest_comment_url = latest_comment_url.split('/')
      let commentid = latest_comment_url[latest_comment_url.length - 1];
      url += `#issuecomment-${commentid}`
    }
    Linking.openURL(url);
    // Mark Read
    if(await this.markRead(id) === false) {
      return;
    }
    this.setState(prevState => ({
      sections: prevState.sections.map(section => ({
        title: section.title,
        data: section.data.map(item => ({
          ...item,
          unread: item.id === id ? false : item.unread,
        }))
      }))
    }), this.forceUpdate)
    // this.props.navigation.dispatch(routeInfo);
  }

  markRead = async (id) => {
    let postUrl = `/notifications/threads/${id}`
    let resp = await fetch(postUrl, this.props.token, { method: 'PATCH' });
    return resp.status === 205;
  }

  clearSection = async ({ title, data }) => {
    let length = data.filter(i => i.unread).length
    if(length == 0) {
      return ;
    }
    Alert.alert(
      'Are you sure',
      `${length} notifications will be cleared`,
      [{
        text: 'Cancel',
        style: 'cancel'
      },{
        'text': 'Clear',
        onPress: () => {
          data.forEach(async (i) => await this.markRead(i.id));
          let ids = data.map(i => i.id);
          this.setState(prevState => ({
            sections: prevState.sections.map(section => ({
              title: section.title,
              data: section.data.map(item => ({
                ...item,
                unread: ids.filter(i => i === item.id).length > 0 ? false : item.unread,
              }))
            }))
          }), this.forceUpdate)
        }
      }]
    )
  }

  render() {
    return (
      <SectionList
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={1}
        contentContainerStyle={styles.scrollView}
        sections={this.state.sections}
        removeClippedSubviews
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <ListItem
            onPress={() => this.openPage(item)}
            item={{title: item.repository.full_name, body: item.subject.title, date: item.updated_at}}
            disabled={!item.unread}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            {this.state.error !== null &&
              <Text style={styles.error}>{this.state.error}</Text>
            }
          </View>
        )}
        renderSectionHeader={({section}) =>
          <View>
            {section.data.length > 0 &&
              <SectionHeader
                title={section.title}
                onPress={() => this.clearSection(section)}
                disabled={section.data.filter(i => i.unread).length === 0}
              />
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
    )
  }
}
