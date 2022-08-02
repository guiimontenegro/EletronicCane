import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {css} from './assets/css/Css';
import React, {useState,useEffect,useRef} from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from './config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import * as Speech from 'expo-speech';

export default function App() {

  const [origin,setOrigin]=useState(null);
  const [destination,setDestination]=useState(null);
  const mapEl=useRef(null);
  const [distance,setDistance]=useState(null);
  const [price,setPrice]=useState(null);
  const speak = () => {
    const thingToSay = '1';
    Speech.speak(thingToSay);
  };

  useEffect(()=>{
    (async function(){
      const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
            setOrigin({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.000922,
              longitudeDelta: 0.000421,
            })
        } else {
            throw new Error('Location permission not granted');
        }
    })();

  },[]);


  return (
    <View style={css.container}>
      <MapView 
      style={css.map}
      initialRegion={origin}
      showsUserLocation={true}
      zoomEnabled={true}
      loadingEnabled={true}
      ref={mapEl}
      >
        {destination &&
              <MapViewDirections
                  origin={origin}
                  destination={destination}
                  apikey={config.googleApi}
                  strokeWidth={3}
                  onReady={result=>{
                  setDistance(result.distance);
                  setPrice(result.distance*3);
                  mapEl.current.fitToCoordinates(
                  result.coordinates,{
                  edgePadding:{
                     top:50,
                     bottom:50,
                     left:50,
                     right:50
                 }
             }
         );
        }
      }
  />}

      </MapView>

      <View style={css.search}>
      <GooglePlacesAutocomplete
          placeholder='Para onde vamos?'
          onPress={(data, details = null) => {
          setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.000922,
              longitudeDelta: 0.000421
          });
      }}
      query={{
          key: config.googleApi,
          language: 'pt-br',
      }}
      enablePoweredByContainer={false}
      fetchDetails={true}
      styles={{
        listView:{backgroundColor:'#fff', zIndex:10},
        container:{position:'absolute',width:'100%'}
    }}
  />
		<View style={css.speech}>
			<Button title="Pressione Aqui" onPress={speak} />
		</View>

      </View>
    </View>
  );
}