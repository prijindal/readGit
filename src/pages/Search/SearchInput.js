// @flow
import React, { PureComponent } from 'react';
import { View, TextInput, TouchableNativeFeedback } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, LeftIcon, TitleContainer, RightIconsContainer, RightIcon } from '../../components/Toolbar';

import { textPrimary, textDarkPrimary, textDarkSecondary, transparent } from '../../colors';

class SearchInput extends PureComponent {
  render() {
    return (
      <Container style={{backgroundColor: textPrimary}}>
        <TouchableNativeFeedback onPress={this.props.onBackPress} background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <LeftIcon>
            <Icon name="arrow-back" size={24} color={textDarkPrimary.toString()}/>
          </LeftIcon>
        </TouchableNativeFeedback>
        <TitleContainer>
          <TextInput
            onChangeText={this.props.onChangeText}
            value={this.props.searchText}
            placeholder="Search"
            keyboardType="web-search"
            returnKeyType="search"
            underlineColorAndroid={transparent.toString()}
            placeholderTextColor={textDarkSecondary.toString()}
            selectionColor={textDarkPrimary.toString()}
            style={{
              color: textDarkPrimary.toString(),
              fontSize: 18,
            }}
            onSubmitEditing={this.props.onSubmitEditing}
            autoFocus
            blurOnSubmit
          />
        </TitleContainer>
        <RightIconsContainer>
          {this.props.searchText.length > 0 &&
            <RightIcon name="cancel" size={24} onPress={this.props.onBackPress} color={textDarkSecondary.toString()}/>
          }
          <RightIcon name="search" size={24} onPress={this.props.onSubmitEditing} color={textDarkSecondary.toString()} />
        </RightIconsContainer>
      </Container>
    )
  }
}

export default SearchInput;
