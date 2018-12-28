import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import * as API from '../../utils/API'

import DarkStyles from './styles/DarkStyles.json';
import LightStyles from './styles/LightStyles.json';
// import markerImage from './assets/test.png';

class Map extends Component {
  constructor() {
    super()
    this.state = {
      region: {
        latitude: 0,
        longitude: 0
      },
      ready: true,
      markers: []
    };
  }

  setRegion(region) {
    this.setState({ region });
  }

  componentDidMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.setRegion(region);
      });
    } catch(error) {
      console.log(error.message);
    }
  };

  onRegionChange = async(region) => {
    const markers = await API.getMarkers();
    this.setState( { markers } );
  }

  

  render() {
  const { latitude, longitude } = this.state.region;
  const currentTime = new Date().getHours();
  const mapStyle = currentTime > 8 ? DarkStyles : LightStyles;
  let { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const latitudeDelta = 0.0922;
  const longitudeDelta = latitudeDelta * aspectRatio;
  console.log(this.state.markers)
  
  const markerArray = this.state.markers.map(marker => (
    <MapView.Marker  
    key={marker.id}   
    coordinate={ { latitude: marker.latitude, longitude: marker.longitude } }
    title={marker.location_name}
    >
      <Image source={require('./assets/test.png')}
        style={{ width: 35, height: 53 }}
      />
    </MapView.Marker> 
  ))

  return(
    <View>
      <MapView
        provider={ PROVIDER_GOOGLE }
        style={ styles.container }
        customMapStyle={ mapStyle }
        showsUserLocation={true}
        showsBuildings={true}
        region={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta
        }}
        showsMyLocationButton={true}
        onRegionChangeComplete={this.onRegionChange}

        >
        { markerArray }
        </MapView> 
    </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  }
});


export default Map;
