import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import CustomModal from '@/components/CustomModal'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Profile = () => {
  const { logout, user, userInfo, updateUserData } = useGlobalContext()
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false)

  useEffect(() => {
    const updateData = async () => {
      if (user?.uid) {
        await updateUserData(user?.uid)
      }
    }

    updateData()
  }, [])

  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className="mt-6 font-encode text-2xl text-center">Profile</Text>
      <ScrollView className='flex-1 px-4'>
        <View className=' justify-between items-center mb-10 mt-20'>
          <View className='relative overflow-hidden'>
            <Image
              source={{ uri: userInfo?.photoUrl }}
              className=' h-40 w-40 border-2 rounded-xl'
              resizeMode='cover'
            />
            <TouchableOpacity onPress={() => router.push('/(edit-profile)/profile')} className="absolute border right-[1px] bottom-[1px] bg-white mt-1 p-2 rounded-tl-lg rounded rounded-br-xl ml-auto flex-row gap-1 items-center">
              <MaterialIcons name="edit" size={16} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="mt-8 text-3xl font-psemibold text-center">{userInfo?.name}</Text>
        </View>

        <View className="w-full mb-6 border-2 rounded-[20px] p-5 bg-amber-100">
          <View className="flex-row justify-between">
            <Text className="text-xl font-psemibold">My Skills:</Text>
            <TouchableOpacity onPress={() => router.push('/(edit-profile)/skills')} className="flex-row gap-1 items-center">
              <MaterialIcons name="edit" size={14} color="black" />
              <Text className="text-base font-pmedium underline">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            {userInfo?.skills && userInfo?.skills.map((skill: string, index: number) => (
              <View key={index} className="rounded-lg border px-3 py-1 bg-white">
                <Text className="font-pregular text-base">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="w-full mb-6 border-2 rounded-[20px] p-5 bg-sky-100">
          <View className="flex-row justify-between">
            <Text className="text-xl font-psemibold">My Address:</Text>
            <TouchableOpacity onPress={() => router.push('/(edit-profile)/location')} className="flex-row gap-1 items-center">
              <MaterialIcons name="edit" size={14} color="black" />
              <Text className="text-base font-pmedium underline">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            <Text className='text-lg font-pregular text-gray-600'>{userInfo?.address}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setConfirmLogoutVisible(true)} className='bg-red-200 border-2 rounded-2xl py-2 px-4 w-40 mb-5 flex-row gap-2 items-center justify-center'>
          <MaterialIcons name="logout" size={20} color="black" />
          <Text className='text-lg text-center font-psemibold mt-0.5'>Logout</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => router.push('/onboard')} className='bg-red-200 border-2 rounded-2xl py-2 px-4 w-40'>
          <Text className='text-lg text-center font-psemibold mt-0.5'>Onboard</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={() => router.push('/onboard')} className='bg-black p-2 rounded-lg'><Text className='text-white'>Onboard</Text></TouchableOpacity> */}
      </ScrollView>

      <CustomModal
        visible={confirmLogoutVisible}
        title='Confirm Logout?'
        confirmButtonText='Logout'
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