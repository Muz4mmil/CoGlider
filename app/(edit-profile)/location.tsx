import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LocationScreen } from '@/components/LocationScreen'
import { useGlobalContext } from '@/context/GlobalProvider'
import { updateLocation } from '@/libs/firebase'
import { ImagePickerAsset } from 'expo-image-picker'
import { router } from 'expo-router'

const UpdateLocation = () => {
  const { user } = useGlobalContext()
  const [location, setLocation] = useState({ long: '0', lat: '0' })
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLocationUpdate = async () => {
    if (location.long !== '0' && location.lat !== '0') {
      setLoading(true)
      try {
        const result = await updateLocation(address, location.long, location.lat, user)
        if (result) {
          setLoading(false)
          router.back()
        }
      } catch (error) {
        setLoading(false)
        Alert.alert('Error', (error as Error).message)
      }
    }
  }
  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className='font-encode text-2xl mt-8 text-center'>Update Your Location</Text>
      <LocationScreen
        location={location}
        setLocation={setLocation}
        address={address}
        setAddress={setAddress}
        loading={loading}
        handleLocationUpdate={handleLocationUpdate}
        handleScreenChange={() => router.back()}
        fromEdit={true}
      />
    </SafeAreaView>
  )
}

export default UpdateLocation