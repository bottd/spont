import React, { Component } from "react";
import { StatusBar, View, Text } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";
import * as API from '../../utils/API'

import Map from '../Map'


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      user: '',
      position: {
        latitude: 0,
        longitude: 0,
      }
    }
  }

  async componentDidMount() {
    await this.linkUser()
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    BackgroundGeolocation.ready({
    
      // Geolocation Config
      reset: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,  
      startOnBoot: true, 
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: false,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });
  }

  linkUser = async () => {
    const { user } = this.state;
    if (!user) {
      const user =  await API.getUser()
      await this.setState( { user } )
    }
  }

  onLocation = (location) => {
    if (location.coords.speed === 0) {
      const position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      this.setState({ position } );
      API.logCoords(this.state.user, position);
    }
  }
  
  onError(error) {
    console.warn('[location] ERROR -', error);
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  render() {
    const { position } = this.state;
    return(
      <View >
        <StatusBar barStyle="light-content"/>
        <Map/>
        <View>
          <Text>{`LAT:${position.latitude} LONG:${position.longitude}`}</Text>
        </View>
      </View>
    )
  }
}




