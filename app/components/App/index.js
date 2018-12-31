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

    BackgroundGeolocation.onMotionChange(this.logLocation);

    BackgroundGeolocation.onMotionChange((event) => {
      if (event.isMoving) {
         console.log('[onMotionChange] Device has just started MOVING ', event.location);
      } else {
         console.log('[onMotionChange] Device has just STOPPED:  ', event.location);
      }
    });
    

    // BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    BackgroundGeolocation.ready({
    
      // Geolocation Config
      // reset: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,  
      startOnBoot: true, 
      // url: 'http://yourserver.com/locations',
      // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      // autoSync: false,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      // headers: {              // <-- Optional HTTP headers
      //   "X-FOO": "bar"
      // },
      // params: {               // <-- Optional HTTP params
      //   "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      // }
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
      this.setState( { user } )
    }
  }

  logLocation = event => {
    if (!event.isMoving) {
      const position = {
        latitude: event.location.coords.latitude,
        longitude: event.location.coords.longitude,
      }
      this.setState({ position } );
      API.logCoords(this.state.user, position);
    } else {
      console.log('[onMotionChange] Device has just started MOVING ', event.location);
    }
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  render() {
    const { position, user } = this.state;
    return(
      <View >
        <StatusBar barStyle="light-content"/>
        <Map user={user}/>
        <View>
          <Text>{user}</Text>
        </View>
        <View>
          <Text>{`LAT: ${position.latitude} LONG: ${position.longitude}`}</Text>
        </View>
      </View>
    )
  }
}