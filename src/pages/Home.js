// @flow
import React, { Component } from 'react';
import { Text, FlatList, View, ScrollView, ActivityIndicator } from 'react-native';

import { primary } from '../colors';

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

class Home extends Component {
  componentWillMount() {
    this.updateData();
  }

  updateData = () => {
    let data = Array(this.state.data.length + 10).fill().map((_, i) => ({key: i.toString(), title : (i * i).toString()}));
    this.setState({
      data,
    });
  }

  state = {
    data: [],
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
            renderItem={({item}) => <ListItem item={item}/>}
            ListFooterComponent={() => (
              <View style={styles.loading}>
                <ActivityIndicator color={primary} size={24}/>
              </View>
            )}
            onEndReached={this.updateData}
          />
      </Layout>
    )
  }
}

export default Home;
