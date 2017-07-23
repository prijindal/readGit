// @flow
import React, { PureComponent } from 'react';
import { View, Text, FlatList, ScrollView, Keyboard } from 'react-native';

import sleep from '../../helpers/sleep';

import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

const styles = {
  container: {
    flex: 1
  }
}

class Search extends PureComponent {
  state = {
    searchText: '',
  }

  onBackPress = () => {
    if(this.state.searchText) {
      this.setState({
        searchText: '',
      })
    } else {
      this.props.navigation.goBack()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchInput
          navigation={this.props.navigation}
          onBackPress={this.onBackPress}
          searchText={this.state.searchText}
          onChangeText={(searchText) => this.setState({searchText})}
        />
        <SearchResults
          searchText={this.state.searchText}
        />
      </View>
    )
  }
}

export default Search;
