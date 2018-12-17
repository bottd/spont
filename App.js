import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import DarkStyles from './DarkStyles.json';

export default () => (
  <View style={styles.container}>
  <StatusBar barStyle="light-content"/>
    <MapView
      provider={ PROVIDER_GOOGLE }
      style={ styles.container }
      customMapStyle={ DarkStyles }
      showsUserLocation = {true}
      initialRegion={{
        latitude: 39.7392,
        longitude: -104.9953,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
    }
});