import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from '@/components/InputField'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getChatList } from '@/libs/firebase-messaging'
import { router } from 'expo-router'
import images from '@/constants/images'

interface ChatItem { [key: string]: any; id: string; }

const ChatUser = ({ item, currentUserId }: { item: ChatItem, currentUserId: string | undefined }) => {
  const userInfo = item.otherUserInfo

  return (
    userInfo &&
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/chat/[chatId]',
        params: {
          chatId: item.id,
          currentUserId,
          otherUserId: userInfo.id,
          otherUserName: userInfo.name,
          otherUserPhotoUrl: userInfo.photoUrl,
        }
      })}
      className='flex-row mb-8 items-center'
    >
      <Image source={{ uri: userInfo?.photoUrl }} className='h-[60px] w-[60px] border rounded-xl' resizeMode='cover' />
      <View className='mx-4'>
        <Text numberOfLines={1} className='font-pmedium text-xl mb-1'>{userInfo.name}</Text>
        <Text
          numberOfLines={1}
          className={`${!item.lastMessageReadBy.includes(currentUserId) ? 'font-pmedium text-sky-700' : 'font-pregular text-gray-500'} text-base`}
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
  const [searchName, setSearchName] = useState('')
  const [chatList, setChatList] = useState<{ [key: string]: any; id: string; }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChatList = async () => {
    if (user) {
      setLoading(true)
      await getChatList(user.uid, setChatList)
      setLoading(false)
    }
  }

  const filteredChatList = useMemo(() => {
    if (!searchName) return chatList;
    return chatList.filter(chat => 
      chat.otherUserInfo.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }, [searchName, chatList]);

  useEffect(() => {
    fetchChatList()
  }, [user])

  return (
    <SafeAreaView className='bg-white flex-1 px-4'>
      <Text className="mt-6 font-encode text-2xl text-center">My Chats</Text>

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#0284c7' />
        </View>
      ) : chatList.length !== 0 ? (
        <>
          <InputField title='' value={searchName} handleChange={setSearchName} placeholder='Search' />
          <FlatList
            data={filteredChatList}
            keyExtractor={(item) => item.id}
            renderItem={(item) => (<ChatUser item={item.item} currentUserId={user?.uid} />)}
            className='mt-10'
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
          />
        </>
      ) : (
        <View className='flex-1 items-center justify-center'>
          <Image source={images.nochats} className='h-52 w-52 opacity-80' resizeMode='cover' />
          <Text className='font-encode text-3xl mt-10'>No Chats Yet? :{'('}</Text>
          <Text className='text-xl font-pmedium text-center px-5 mt-5'>How about finding cool mates from the Find Tab and start chatting ?!</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default MyChats