// import React from 'react';

jest.mock('react-native', () => {
    let items = {};

    return {
        AsyncStorage: {
            setItem: jest.fn((item, value) => {
                items[item] = value;
                return Promise.resolve(value);
            }),
            multiSet: jest.fn((item, value) => {
                item.forEach(([key, value]) => {
                    items[key] = value
                })
                return Promise.resolve(value);
            }),
            getItem: jest.fn((item, value) => {
                return Promise.resolve(items[item]);
            }),
            multiGet: jest.fn((keys) => {
                const result = keys.map(key => [key, items[key]])
                return Promise.resolve(result);
            }),
            removeItem: jest.fn((item) => {
                return Promise.resolve(delete items[item]);
            }),
            getAllKeys: jest.fn(() => {
                return Promise.resolve(Object.keys(items));
            }),
            clear: jest.fn((() => {
                items = {}
                return Promise.resolve()
            }))
        } 
    }
});

jest.mock('react-native-maps', () => {                                           
  const React = require.requireActual('react');                                  
  const MapView = require.requireActual('react-native-maps');                    
                                                                                 
  class MockCallout extends React.Component {                                    
    render() {                                                                   
      return React.createElement('Callout', this.props, this.props.children);    
    }                                                                            
  }                                                                              
                                                                                 
  class MockMarker extends React.Component {                                     
    render() {                                                                   
      return React.createElement('Marker', this.props, this.props.children);     
    }                                                                            
  }                                                                              
                                                                                 
  class MockMapView extends React.Component {                                    
    render() {                                                                   
      return React.createElement('MapView', this.props, this.props.children);    
    }                                                                            
  }                                                                              
                                                                                 
  MockCallout.propTypes = MapView.Callout.propTypes;                             
  MockMarker.propTypes = MapView.Marker.propTypes;                               
  MockMapView.propTypes = MapView.propTypes;                                     
  MockMapView.Marker = MockMarker;                                               
  MockMapView.Callout = MockCallout;                                             
  return MockMapView;                                                            
}); 