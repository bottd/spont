import * as API from '../utils/API';
import { AsyncStorage, fetch } from 'react-native'


describe('API', () => {
  beforeEach(() => {
   
  });

  it('should return a user ID if stored in device', async() => {
    const expected = 'abc123';
    AsyncStorage.setItem('spontUser', expected);

    const result = await API.getUser();
    expect(result).toBe(expected);

    AsyncStorage.removeItem('spontUser');
  })

  it('should call createUser if device has no user', async() => {
    API.createUser = jest.fn(() => 'abc123')
    console.log(API.createUser())
    await API.getUser();
    expect(API.createUser.mock.calls.length).toBe(1)
  })

  it('should create a new userID if device has no userID', async() => {
    const expected = {
      data: {
        createUser: {
          id: 'abc123'
        }
      }
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(expected)
    }))

    const result = await API.createUser();
    
    expect(result).toBe('abc123')
  })

  it('should get locations of other users', async() => {
    const expected = {
      data: {
        locations: [{ lat: 12312432, long: 42354325 }]
      }
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(expected)
    }))

    const result = await API.getMarkers();
    
    expect(result[0].lat).toBe(12312432)
  })
});