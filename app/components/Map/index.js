import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";

import DarkStyles from './styles/DarkStyles.json';
import LightStyles from './styles/LightStyles.json';
import markerImage from './assets/test.png';

const Map = ( { latitude, longitude } ) => {

  const currentTime = new Date().getHours();
  console.log(currentTime)
  const mapStyle = currentTime > 8 ? DarkStyles : LightStyles;
  let { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const latitudeDelta = 0.0922;
  const longitudeDelta = latitudeDelta * aspectRatio;
  
  return(
    <View>
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
        >
        <MapView.Marker     
          coordinate={ { latitude: 39.751714, longitude: -104.99200 } }
          image={ markerImage }
          title={'hey'}
          /> 
        <MapView.Marker     
          coordinate={ { latitude: 39.755714, longitude: -104.98200 } }
          image={ markerImage }
          title={'hey'}
          /> 
        </MapView> 
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
