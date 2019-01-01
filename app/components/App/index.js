import React, { Component } from "react";
import { StatusBar, View, Text } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";
import * as API from '../../utils/API'

import Map from '../Map'


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      user: ''
    }
  }

  async componentWillMount() {
    await this.linkUser()
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    BackgroundGeolocation.ready({
      reset: true,
      disableStopDetection: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopTimeout: 1,
      debug: true, 
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true
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
  
  onLocation = location => {
    const { latitude, longitude } = location.coords;
    if (location.coords.speed === 0) {
      const position = { latitude, longitude }
      API.logCoords(this.state.user, position);
    }
  }
  
  onError = error => {
    return
  }
  
  onMotionChange = event => {
    const { latitude, longitude } = event.location.coords;
    if (!event.isMoving) {
      const position = { latitude, longitude }
      API.logCoords(this.state.user, position);
    }
  }
  
  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  render() {
    const { user } = this.state;
    return(
      <View >
        <StatusBar barStyle="light-content"/>
        <Map user={user}/>
      </View>
    )
  }
}