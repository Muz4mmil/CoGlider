import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '@/components/InputField'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getChatList } from '@/libs/firebase-messaging'
import { getUserInfo } from '@/libs/firebase'
import { DocumentData } from 'firebase/firestore'
import { router } from 'expo-router'
import images from '@/constants/images'

interface ChatItem { [key: string]: any; id: string; }

const ChatUser = ({ item, currentUserId }: { item: ChatItem, currentUserId: string | undefined }) => {
  const [userInfo, setUserInfo] = useState<DocumentData | undefined>()
  const otherParticipantId = item.participants.find((id: string) => id !== currentUserId)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const info = await getUserInfo(otherParticipantId)
        setUserInfo(info)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchUser()
  }, [item.participants, currentUserId])

  return (
    userInfo &&
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/chat/[chatId]',
        params: {
          chatId: item.id,
          currentUserId,
          otherUserId: otherParticipantId,
          otherUserName: userInfo.name
        }
      })}
      className='flex-row mb-8 items-center'
    >
      <Image source={{ uri: userInfo?.photoUrl }} className='h-[60px] w-[60px] border rounded-xl' resizeMode='cover' />
      <View className='mx-4'>
        <Text numberOfLines={1} className='font-pmedium text-xl mb-1'>{userInfo.name}</Text>
        <Text
          numberOfLines={1}
          className={`${!item.lastMessageReadBy.includes(currentUserId) ? 'font-psemibold text-sky-700' : 'font-pregular text-gray-500'}`}
        >
          {item.lastMessage || "Tap to start chatting"}
        </Text>
      </View>
      {!item.lastMessageReadBy.includes(currentUserId) && <View className='h-4 w-4 ml-auto mr-4 border rounded-full bg-sky-500'></View>}
    </TouchableOpacity>
  )
}

const MyChats = () => {
  const { user } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [chatList, setChatList] = useState<{ [key: string]: any; id: string; }[]>([])

  useEffect(() => {
    if (user) {
      getChatList(user.uid, setChatList)
    }
  }, [user])

  return (
    <SafeAreaView className='bg-white flex-1 px-4'>
      <Text className="mt-6 font-encode text-2xl text-center">My Chats</Text>
      <InputField title='' value={searchQuery} handleChange={(e) => setSearchQuery(e)} placeholder='Search' />

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (<ChatUser item={item.item} currentUserId={user?.uid} />)}
        className='mt-10'
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
      />
    </SafeAreaView>
  )
}

export default MyChats