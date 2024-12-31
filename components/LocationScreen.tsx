import { View, Text } from 'react-native'
import React, { SetStateAction, useState } from 'react'
import Button from '@/components/Button'
import { router } from 'expo-router'
import InputField from './InputField'

type LocationScreenProps = {
  handleScreenChange: (screen: number) => void
  location: { long: string, lat: string }
  setLocation: React.Dispatch<SetStateAction<{ long: string; lat: string; }>>
  handleLocationUpdate: () => void
  loading: boolean
}

export const LocationScreen = ({ handleScreenChange, location, setLocation, handleLocationUpdate, loading }: LocationScreenProps) => {

  return (
    <View className='flex-1 px-4'>
      <View className='mt-20 justify-center items-center'>
        <Text className='font-psemibold text-xl'>Set Your Location</Text>
        <InputField title='Latitude' value={location.lat} handleChange={(e) => setLocation({...location, lat: e})} placeholder='Enter your latitude' />
        <InputField title='Longitutde' value={location.long} handleChange={(e) => setLocation({...location, long: e})} placeholder='Enter your longitude' />

        <Text>Lat: {location.lat}</Text>
        <Text>Long: {location.long}</Text>
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
            containerStyles='flex-1 bg-sky-200'
            loading={loading}
            handlePress={handleLocationUpdate}
          />
        </View>
      </View>
    </View>
  )
}