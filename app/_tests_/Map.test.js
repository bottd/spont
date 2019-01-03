import React from 'react';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Map from '../components/Map';

import renderer from 'react-test-renderer';




it('renders correctly', () => {
  const tree = renderer.create(
    <Map />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});