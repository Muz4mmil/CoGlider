import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ProfilePictureScreen } from '@/components/ProfilePictureScreen'
import { useGlobalContext } from '@/context/GlobalProvider'
import { ImagePickerAsset } from 'expo-image-picker'
import { router } from 'expo-router'
import { updateProfilePicture } from '@/libs/firebase'

const UpdateProfile = () => {
  const { user } = useGlobalContext()
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null)
  const [loading, setLoading] = useState(false)
  // const [name, setName] = useState<string | null>('')

  // useEffect(() => {
  //   user && setName(user?.displayName)
  // }, [])

  const handleImageUpdate = async () => {
    if (selectedImage) {
      setLoading(true)
      try {
        const result = await updateProfilePicture(selectedImage, user)
        if (result) {
          router.back()
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <SafeAreaView className='bg-white flex-1'>
      {/* <Text className='font-encode text-2xl mt-8 text-center'>Update Your Profile</Text> */}
      <ProfilePictureScreen
        user={user}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        // name={name}
        // setName={setName}
        handleScreenChange={() => router.back()}
        handleImageUpdate={handleImageUpdate}
        loading={loading}
        fromEdit={true}
      />
    </SafeAreaView>
  )
}

export default UpdateProfile