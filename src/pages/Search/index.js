// @flow
import React, { PureComponent } from 'react';
import { View, Text, FlatList, ScrollView, Keyboard } from 'react-native';

import sleep from '../../helpers/sleep';

import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

const results = {
  "data": {
    "reporesults": {
      "edges": [
        {
          "node": {
            "name": "react",
            "owner": {
              "login": "facebook"
            }
          }
        },
        {
          "node": {
            "name": "react",
            "owner": {
              "login": "reactphp"
            }
          }
        },
        {
          "node": {
            "name": "react",
            "owner": {
              "login": "duxianwei520"
            }
          }
        },
        {
          "node": {
            "name": "react-pxq",
            "owner": {
              "login": "bailicangdu"
            }
          }
        },
        {
          "node": {
            "name": "react",
            "owner": {
              "login": "azat-co"
            }
          }
        }
      ]
    },
    "userresults": {
      "edges": [
        {
          "node": {
            "name": "Simon Hafner"
          }
        },
        {
          "node": {
            "name": "Christopher Chapman"
          }
        },
        {
          "node": {
            "name": "Yu"
          }
        },
        {
          "node": {
            "name": "David Godfrey"
          }
        },
        {
          "node": {
            "name": "Paul Xu"
          }
        }
      ]
    }
  }
}

const styles = {
  container: {
    flex: 1
  }
}

class Search extends PureComponent {
  state = {
    searchText: '',
    loading: false,
    results: {}
  }

  onBackPress = () => {
    if(this.state.searchText) {
      this.setState({
        searchText: ''
      })
    } else {
      this.props.navigation.goBack()
    }
  }

  onSubmitEditing = async () => {
    Keyboard.dismiss();
    this.setState({
      loading: true,
    })
    await sleep(1000);
    this.setState({
      results: results,
      loading: false,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchInput
          navigation={this.props.navigation}
          onSubmitEditing={this.onSubmitEditing}
          onBackPress={this.onBackPress}
          searchText={this.state.searchText}
          onChangeText={(searchText) => this.setState({searchText})}
        />
        <SearchResults
          results={this.state.results}
          loading={this.state.loading}
        />
      </View>
    )
  }
}

export default Search;
