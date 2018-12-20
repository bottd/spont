import React, { Component } from "react";
import { StatusBar, View } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";

import Map from '../Map'


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      position: {
        latitude: 39.751214,
        longitude: -104.996227,
      }
    }
  }

  // componentDidMount() {
  //   BackgroundGeolocation.onLocation(this.onLocation, this.onError);
  //   BackgroundGeolocation.ready({
  //     desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  //     distanceFilter: 10,
  //     stopTimeout: 1,
  //     logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  //     stopOnTerminate: false,
  //     startOnBoot: true,
  //     url: 'http://yourserver.com/locations',
  //     batchSync: false,
  //     autoSync: true,
  //     headers: {
  //       "X-FOO": "bar"
  //     },
  //      params: {               // <-- Optional HTTP params
  //       "auth_token": "maybe_your_server_authenticates_via_token_YES?"
  //     }
  //   }, (state) => {
  //     console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

  //     if (state.enabled) {
  //       BackgroundGeolocation.start(function() {
  //         console.log("- Start success");
  //       });
  //     }
  //   });
  // }

  // onLocation = (location) => {
  //   console.log('[location] -', location);
  //   const position = {
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //   }
  //   this.setState({ position })
  // }

  // onError(error) {
  //   console.warn('[location] ERROR -', error);
  // }

  // componentWillUnmount() {
  //   BackgroundGeolocation.removeListeners();
  // }

  render() {
    const { position } = this.state;
    return(
      <View >
        <StatusBar barStyle="light-content"/>
        <Map {...position}/>
      
      </View>
    )
  }
}




