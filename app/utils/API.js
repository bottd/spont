import { AsyncStorage } from "react-native";


export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('spontUser');
    if (user !== null) {
      return user;
    } else {
      const newUser = await createUser();
      AsyncStorage.setItem('spontUser', newUser)
      return newUser;
    }
   } catch (error) {
     console.log(error.message)
   }
}

export const createUser = async () => {
  const query = JSON.stringify({
    query: `mutation {
          createUser { 
            id 
          }
        }`
  });

  const response = await fetch(`http://spont-server.herokuapp.com/graphql`, {
    headers: {'content-type': 'application/json'},
    method: 'POST',
    body: query,
  });
  
  const data = await response.json();
  return data.data.createUser.id;
}


export const getMarkers = async(user) => {
  const query = JSON.stringify({
    query: `query {
          user(id: "${user}") {
            locations {
              id
              location_name
              category
              latitude
              longitude 
            } 
          }
        }`
  });

  const response = await fetch(`http://spont-server.herokuapp.com/graphql`, {
    headers: {'content-type': 'application/json'},
    method: 'POST',
    body: query,
  });
  
  const data = await response.json();
  return data.data.user.locations;
}
