import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@/components/Button'
import images from '@/constants/images'
import { router } from 'expo-router'
import { registerForPushNotifications } from '@/libs/notifications'

const home = () => {
  const { user, userInfo } = useGlobalContext()

  useEffect(() => {
    if (user) {
      registerForPushNotifications(user.uid);
    }
  }, [user]);
  
  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className="mt-6 font-encode text-2xl text-center">CoGlider</Text>

      <View className="flex-1 justify-center items-center px-4">
        <View className='relative'>
          <Text className="font-encode text-center text-5xl">Team Up,</Text>
          <Text className="font-encode text-center text-5xl mt-2">Build Better!</Text>
          <Image source={images.line} className='absolute right-0 -bottom-[18px] h-10 w-40 rotate-[174deg]' resizeMode='contain' />
        </View>
        <Text className="text-gray-600 text-lg mt-10 text-center font-pregular px-4">
          Connect with skilled individuals and bring your ideas to life.
        </Text>

        <Button containerStyles='mt-10 w-full bg-sky-200 py-[40px]' title="Find a Partner for My Project" handlePress={() => router.push('/search-form')} />
        <Button containerStyles='mt-6 w-full bg-white py-[40px]' title="Find Someone Like Me" handlePress={() => router.push({ pathname: '/results', params: { skills: userInfo?.skills } })} />
      </View>
    </SafeAreaView>
  )
}

export default home