import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import CustomModal from '@/components/CustomModal'

const Profile = () => {
  const { logout, user, userInfo } = useGlobalContext()
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false)
  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className="mt-6 font-encode text-2xl text-center">Profile</Text>
      <ScrollView className='flex-1 px-4'>
        <View className=' justify-between items-center mb-14 mt-20'>
          <Image
            source={userInfo?.photoUrl ? { uri: userInfo?.photoUrl } : images.defaultProfile}
            className='h-36 w-36 border-2 rounded-xl'
            resizeMode='cover'
          />
          <Text className="mt-8 text-3xl font-psemibold text-center">{userInfo?.name}</Text>
        </View>

        <View className="w-full mb-6 border-2 rounded-[20px] p-5 bg-amber-100">
          <View className="flex-row justify-between">
            <Text className="text-xl font-psemibold">My Skills:</Text>
            <Text className="font-pmedium">Edit</Text>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            {userInfo?.skills.map((skill: string, index: number) => (
              <View key={index} className="rounded-lg border px-3 py-1 bg-white">
                <Text className="font-pregular text-base">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="w-full mb-6 border-2 rounded-[20px] p-5 bg-sky-100">
          <View className="flex-row justify-between">
            <Text className="text-xl font-psemibold">My Address:</Text>
            <Text className="font-pmedium">Edit</Text>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            <Text className='text-lg font-pmedium'>H.no. 69, Lane 23, New Baijipura, Aurangabad</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setConfirmLogoutVisible(true)} className='bg-red-200 border-2 rounded-2xl py-2 px-4 w-40'>
          <Text className='text-lg text-center font-psemibold mt-0.5'>Logout</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => router.push('/onboard')} className='bg-black p-2 rounded-lg'><Text className='text-white'>Onboard</Text></TouchableOpacity> */}
      </ScrollView>

      <CustomModal
        visible={confirmLogoutVisible}
        title='Confirm Logout?'
        onCancel={() => setConfirmLogoutVisible(false)}
        onConfirm={() => {
          logout()
          setConfirmLogoutVisible(false)
        }}
      />
    </SafeAreaView>
  )
}

export default Profile