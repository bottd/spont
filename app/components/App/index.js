import React, { Component } from "react";
import { StatusBar, View, Button } from "react-native";
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
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    BackgroundGeolocation.ready({
      reset: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopTimeout: 2,
      debug: true, 
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      batchSync: false,
      autoSync: false, 
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
  
  onMotionChange = async event => {
    const currentTime = new Date().toLocaleString();
    BackgroundGeolocation.logger.notice(`onMotionChange fired at ${currentTime}`);
    const { latitude, longitude } = event.location.coords;
    if (!event.isMoving) {
      const position = { latitude, longitude }
      await this.linkUser()
      BackgroundGeolocation.logger.ok(this.state.user);
      const response = await API.logCoords(this.state.user, position);
      BackgroundGeolocation.logger.ok(`API fired at ${currentTime}`);
      BackgroundGeolocation.logger.ok(response.userID);
      BackgroundGeolocation.logger.ok(response.latitude);
      BackgroundGeolocation.logger.ok(response.longitude);
    }
  }

  sendLog = () => {
    BackgroundGeolocation.emailLog('g@masterofnone.com')
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
        <Button
          onPress={this.sendLog}
          title="Send Log"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    )
  }
}