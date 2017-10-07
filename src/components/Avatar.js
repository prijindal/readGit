// @flow
import React from 'react';
import styled from 'styled-components/native';

const Image = styled.Image`
  width: 50;
  height: 50;
  border-radius: 25;
`;

type AvatarType = {
  url: string,
  style: Object,
};

const Avatar = ({ url, style }: AvatarType) => <Image source={{ uri: url }} style={style} />;

export default Avatar;
