import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StatusBar, StyleSheet, View, Dimensions } from "react-native";
import DarkStyles from './styles/DarkStyles.json';



const Map = ( { latitude, longitude } ) => {
  let { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const latitudeDelta = 0.0922;
  const longitudeDelta = latitudeDelta * aspectRatio;
  return(
    <View>
      <StatusBar barStyle="light-content"/>
      <MapView
        provider={ PROVIDER_GOOGLE }
        style={ styles.container }
        customMapStyle={ DarkStyles }
        showsUserLocation = {true}
        region={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  }
});


export default Map;
