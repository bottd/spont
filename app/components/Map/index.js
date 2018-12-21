import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions, Image } from "react-native";

import DarkStyles from './styles/DarkStyles.json';
import LightStyles from './styles/LightStyles.json';
// import markerImage from './assets/test.png';

const Map = ( { latitude, longitude } ) => {

  const currentTime = new Date().getHours();
  const mapStyle = currentTime > 8 ? DarkStyles : LightStyles;
  console.log(mapStyle)
  let { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const latitudeDelta = 0.0922;
  const longitudeDelta = latitudeDelta * aspectRatio;
  
  return(
    <View>
      <MapView
        provider={ PROVIDER_GOOGLE }
        style={ styles.container }
        customMapStyle={ mapStyle }
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
          title={'hey'}
        >
        <Image source={require('./assets/test.png')}
          style={{ width: 35, height: 53 }}
        />
        </MapView.Marker> 
        <MapView.Marker     
          coordinate={ { latitude: 39.755714, longitude: -104.98200 } }
          title={'hey'}
        >
        <Image source={require('./assets/test.png')}
          style={{ width: 35, height: 53 }}
        />
        </MapView.Marker>
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
