// @flow
import React, { PureComponent } from 'react';
import { TextInput } from 'react-native';

import { Container, TitleContainer, RightIconsContainer } from '../../components/Toolbar/styles';
import RightIcon from '../../components/Toolbar/RightIcon';

import { textPrimary, textDarkPrimary, textDarkSecondary, transparent } from '../../colors';

class SearchInput extends PureComponent {
  render() {
    return (
      <Container style={{backgroundColor: textPrimary}}>
        <RightIcon onPress={this.props.onBackPress} name={'arrow-back'} size={24} color={textDarkPrimary.toString()} />
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
            autoFocus
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
