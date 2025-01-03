import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { SetStateAction, useState } from 'react'
import Button from '@/components/Button'
import { router } from 'expo-router'
import InputField from './InputField'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

type LocationScreenProps = {
  handleScreenChange: (screen: number) => void
  location: { long: string, lat: string }
  setLocation: React.Dispatch<SetStateAction<{ long: string; lat: string; }>>
  address: string
  setAddress: React.Dispatch<SetStateAction<string>>
  handleLocationUpdate: () => void
  loading: boolean
}

export const LocationScreen = ({ handleScreenChange, location, setLocation, address, setAddress, handleLocationUpdate, loading }: LocationScreenProps) => {
  const MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setLocation({
        lat: latitude,
        long: longitude
      })

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        console.log('Current Location', formattedAddress);
      } else {
        Alert.alert('Error', 'Could not fetch address. Try again later.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching the location.');
    }
  };

  return (
    <View className='flex-1 px-4'>
      <View className='mt-10'>
        <Text className='font-psemibold text-xl mb-4'>Enter your Location so others can find you.</Text>
        <View className="my-4 relative h-[230px] w-full">
          <GooglePlacesAutocomplete
            placeholder='Search for your area/locality...'
            fetchDetails={true}
            onPress={(data, details = null) => {
              setAddress(data.description);
              console.log(details?.geometry?.location)
              setLocation({
                lat: details?.geometry?.location?.lat,
                long: details?.geometry?.location?.lng
              })
            }}
            query={{
              key: MAPS_API_KEY,
              language: 'en',
            }}
            styles={{
              listView: {
                borderColor: '#ccc',
                borderRadius: 8,
                borderWidth: 1,
                borderStyle: 'solid',
              },
              textInput: {
                borderStyle: 'solid',
                borderWidth: 2,
                borderColor: '#000',
                borderRadius: 16,
                fontSize: 18,
                height: 56,
              },
            }}
          />
        </View>

        <View className='items-center'>
          <Text className=' text-gray-700 text-sm font-pregular'>OR Automatically Detect your location</Text>
          {/* <Button title="Locate Me" handlePress={getCurrentLocation} containerStyles='mt-5 bg-red-100 w-52' /> */}
          <TouchableOpacity onPress={getCurrentLocation} className='bg-red-100 border-2 rounded-2xl mt-4 py-2 px-4 w-40'>
            <Text className='text-lg text-center font-psemibold mt-0.5'>Locate Me</Text>
          </TouchableOpacity>
        </View>

        {address && <View className='mt-8'>
          <Text className='font-pmedium'>Current Address: </Text>
          <Text className='font-pregular text-gray-500'>{address}</Text>
        </View>}
      </View>

      <View className='px-4 pb-6 pt-4 border-t border-gray-200 mt-auto'>
        <View className='flex-row gap-4'>
          <Button
            title="Back"
            containerStyles='flex-1 bg-white'
            handlePress={() => handleScreenChange(2)}
          />
          <Button
            title="Finish"
            containerStyles='flex-1 bg-red-200'
            loading={loading}
            disabled={!address}
            handlePress={handleLocationUpdate}
          />
        </View>
      </View>
    </View>
  )
}