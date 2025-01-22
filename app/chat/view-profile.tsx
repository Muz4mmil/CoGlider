import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserInfo } from '@/libs/firebase'
import { DocumentData } from 'firebase/firestore'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const ViewProfile = () => {
  const { id } = useLocalSearchParams()
  const [userInfo, setUserInfo] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true)
      await getUserInfo(id)
        .then((user) => {
          if (user) {
            setUserInfo(user);
            setLoading(false)
          }
        })
    }

    fetchUserInfo()
  }, [])

  return (
    <SafeAreaView className='bg-white flex-1'>
      <View className='flex-row items-center'>
        <TouchableOpacity className='p-5' onPress={() => router.back()}>
          <MaterialCommunityIcons name='arrow-left' size={28} />
        </TouchableOpacity>
        <Text className="font-encode text-2xl text-center">Profile</Text>
      </View>
      {!loading && <ScrollView className='flex-1 px-4'>
        <View className=' justify-between items-center mb-10 mt-10'>
          <View className='relative overflow-hidden'>
            <Image
              source={{ uri: userInfo?.photoUrl }}
              className='h-60 w-60 border-2 rounded-xl'
              resizeMode='cover'
            />
          </View>
          <Text className="mt-8 text-3xl font-psemibold text-center">{userInfo?.name}</Text>
        </View>

        <View className="w-full mb-6 border-2 rounded-[20px] p-5 bg-amber-100">
          <Text className="text-xl font-psemibold">Skills:</Text>
          <View className="flex-row flex-wrap gap-2 mt-4">
            {userInfo?.skills && userInfo?.skills.map((skill: string, index: number) => (
              <View key={index} className="rounded-lg border px-3 py-1 bg-white">
                <Text className="font-pregular text-base">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="w-full mb-6 border-2 rounded-[20px] p-5 bg-sky-100">
          <Text className="text-xl font-psemibold">Address:</Text>
          <View className="flex-row flex-wrap gap-2 mt-4">
            <Text className='text-lg font-pregular text-gray-600'>{userInfo?.address}</Text>
          </View>
        </View>
      </ScrollView>}
    </SafeAreaView>
  )
}

export default ViewProfile