import React, { Component } from "react";
import { StatusBar, View, Text, AsyncStorage } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";

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
      const user =  await this.getUser()
      await this.setState( { user } )
    }
  }

  getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('spontUser');
      if (user !== null) {
        console.log(user)
        return user;
      } else {
        const newUser = await this.createUser();
        AsyncStorage.setItem('spontUser', newUser)
        return newUser;
      }
     } catch (error) {
       console.log(error.message)
     }
  }

  createUser = async () => {
    const query = JSON.stringify({
      query: `mutation {
            createUser { 
              id 
            }
          }`
    });

    console.log(query)

  
    const response = await fetch(`http://spont-server.herokuapp.com/graphql`, {
      headers: {'content-type': 'application/json'},
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    return data.data.createUser.id;
  }
  
  onLocation = (location) => {
    // console.log('[location] -', location);
    if (location.coords.speed === 0) {
      const position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      this.setState({ position } );
      this.logCoords(position);
    }
  }

  logCoords = async (position) => {
    const { latitude, longitude } = position;
    const { user } =  this.state;
    // console.log(user, latitude, longitude)
    
    
    let url = 'http://spont-server.herokuapp.com/graphql';
    let query = `mutation ($userID: String!, $latitude: Float!, $longitude: Float!) {
      insertCoords(userID:$userID, latitude:$latitude, longitude:$longitude) { userID, latitude, longitude }
    }`;

    let variables = {
      userID: user,
      latitude: latitude,
      longitude: longitude
    }

    const response =  await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( { query, variables } )
    })
    
    const data = await response.json()
    console.log(data)
  
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




