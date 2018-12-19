import React, { Component } from "react";
import { StatusBar, StyleSheet, View, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import BackgroundGeolocation from "react-native-background-geolocation";
import DarkStyles from '../../styles/DarkStyles.json';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      region: {
        latitude: 39.751214,
        longitude: -104.996227,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    }
  }

  componentDidMount() {
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopTimeout: 1,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      url: 'http://yourserver.com/locations',
      batchSync: false,
      autoSync: true,
      headers: {
        "X-FOO": "bar"
      },
       params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (state.enabled) {
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });
  }

  onLocation = (location) => {
    console.log('[location] -', location);
    const { latitudeDelta, longitudeDelta } = this.state.region;
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta, longitudeDelta
    }
    this.setState({ region })
  }
  onError(error) {
    console.warn('[location] ERROR -', error);
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  render() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
    console.log(this.state.region)
    return(
      <View style={styles.container}>
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
}



const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
    }
});
