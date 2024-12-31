import { View, Text, Image, Alert } from 'react-native'
import React, { SetStateAction } from 'react'
import Button from '@/components/Button'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ImagePickerAsset } from 'expo-image-picker'
import images from '@/constants/images';

type ProfilePictureScreenProps = {
  user: any
  selectedImage: ImagePickerAsset | null
  setSelectedImage: React.Dispatch<SetStateAction<ImagePickerAsset | null>>
  handleScreenChange: (screen: number) => void
  handleImageUpdate: () => void
  loading: boolean
}

export const ProfilePictureScreen = ({
  user,
  selectedImage,
  setSelectedImage,
  handleScreenChange,
  handleImageUpdate,
  loading
}: ProfilePictureScreenProps) => {
  const openPicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const manipulatedImage = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400, height: 400 } }],
          { format: SaveFormat.JPEG }
        );

        setSelectedImage({
          ...result.assets[0],
          uri: manipulatedImage.uri,
          width: manipulatedImage.width,
          height: manipulatedImage.height,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to process image');
        console.error(error);
      }
    }
  };

  return (
    <View className='flex-1 px-4'>
      <View className='mt-20 justify-center items-center'>
        <Text className='font-psemibold text-xl'>Wanna Update your Profile Picture?</Text>
        <Image
          source={selectedImage ? { uri: selectedImage.uri } : { uri: user?.photoURL || images.defaultProfile }}
          className="mt-10 w-60 h-60 rounded-3xl rounded-b-none border-2 bg-gray-200 overflow-hidden"
        />
        <Button
          title="Choose a Picture"
          handlePress={openPicker}
          containerStyles='bg-white w-60 px-8 mt-[-2px] rounded-t-none'
        />
      </View>

      <View className='pb-6 pt-4 border-t border-gray-200 mt-auto'>
        <View className='flex-row gap-4'>
          <Button
            title="Skip for now"
            containerStyles='flex-1 bg-white'
            handlePress={() => handleScreenChange(2)}
          />
          <Button
            title="Update"
            containerStyles='flex-1 bg-sky-200'
            disabled={!selectedImage}
            handlePress={handleImageUpdate}
            loading={loading}
          />
        </View>
      </View>
    </View>
  )
}