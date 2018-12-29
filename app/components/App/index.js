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

  async componentDidMount() {
    await this.linkUser()
    BackgroundGeolocation.onMotionChange(this.onMotionChange)
    BackgroundGeolocation.ready({
      reset: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 15,
      stopTimeout: 1,
      // debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,  
      startOnBoot: true
    }, (state) => {
      if (!state.enabled) {
        BackgroundGeolocation.start();
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

  onMotionChange = event => {
    if (!event.isMoving) {
      const position = {
        latitude: event.location.coords.latitude,
        longitude: event.location.coords.longitude,
      }
      API.logCoords(this.state.user, position);
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
      </View>
    )
  }
}




