import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {css} from './assets/css/Css';
import React, {useState,useEffect,useRef} from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from './config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {

  const [origin,setOrigin]=useState(null);
  const [destination,setDestination]=useState(null);
  const mapEl=useRef(null);
  const [distance,setDistance]=useState(null);
  const [price,setPrice]=useState(null);

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
   {distance &&
    <View style={css.distance}>
        <Text style={css.distance__text}>Distância: {distance.toFixed(2).replace('.',',')}km</Text>
        <Text>Custo Médio de R$3,00 por Km</Text>
        <TouchableOpacity style={css.price}>
            <Text style={css.price__text}><MaterialIcons name="payment" size={24} color="white" /> Pagar R${price.toFixed(2).replace('.',',')}</Text>
        </TouchableOpacity>
    </View>
}


      </View>
    </View>
  );
}