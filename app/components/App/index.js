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

    BackgroundGeolocation.ready({
      reset: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      elasticityMultiplier: 10,
      stopTimeout: 2,
      debug: true, 
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      url: 'http://spont-server.herokuapp.com/locations',
      params: {
        'userID': this.state.user,
      },
      batchSync: false,
      autoSync: true,
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