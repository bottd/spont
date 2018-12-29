import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import * as API from '../../utils/API'

import DarkStyles from './styles/DarkStyles.json';
import LightStyles from './styles/LightStyles.json';

class Map extends Component {
  constructor() {
    super()
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      mapStyle: '',
      mapReady: false,
      markers: []
    };
  }

  componentDidMount() {
    this.setRegion();
    this.setStyle()
  }

  setRegion = () => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const { width, height } = Dimensions.get('window');
        const aspectRatio = width / height;
        const latitudeDelta = 0.0922;
        const longitudeDelta = latitudeDelta * aspectRatio;
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta,
          longitudeDelta
        };
        this.setState({ region, mapReady: !this.state.mapReady });
      });
    } catch(error) {
      console.log(error.message);
    }
  }

  setStyle = () => {
    const currentTime = new Date().getHours();
    const mapStyle = currentTime < 18 ? DarkStyles : LightStyles;
    this.setState({ mapStyle });
  }

  onRegionChange = async(position) => {
    const markers = await API.getMarkers(this.props.user);
    this.setState( { markers } );
  }

  render() {
    const { region, mapReady, mapStyle } = this.state;
    
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

    if (mapReady) {
      return(
        <View>
          <MapView
            // ref={ref => { this.map = ref; } }
            provider={ PROVIDER_GOOGLE }
            style={ styles.container }
            customMapStyle={ mapStyle }
            showsUserLocation={true}
            showsBuildings={true}
            initialRegion={region}
            showsMyLocationButton={true}
            onRegionChangeComplete={this.onRegionChange}
    
            >
            { markerArray }
            </MapView> 
        </View>
      )
    } else {
      return(<View></View>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  }
});


export default Map;
