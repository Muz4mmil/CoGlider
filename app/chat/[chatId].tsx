import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { getMessages, sendMessage } from '@/libs/firebase-messaging'
import InputField from '@/components/InputField'
import { db } from '@/configs/firebase-config'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const Chat = () => {
  const { user } = useGlobalContext()
  const { chatId, currentUserId, otherUserId, otherUserName } = useLocalSearchParams() as { 
    chatId: string, 
    currentUserId: string, 
    otherUserId: string, 
    otherUserName: string 
  }

  const flatListRef = useRef<FlatList>(null)
  const [messages, setMessages] = useState<{ [key: string]: any; id: string; }[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [initialLoad, setInitialLoad] = useState(true)

  const messagesRef = collection(db, "chats", chatId, "messages")

  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setMessages(newMessages)
      
      if (!initialLoad && flatListRef.current && newMessages.length > messages.length) {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, 100)
      }
      
      if (initialLoad) {
        setInitialLoad(false)
      }
    })

    return () => unsubscribe()
  }, [messages.length])

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    setNewMessage('')
    sendMessage(chatId, currentUserId, newMessage)
    
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    }, 100)
  }

  const renderMessage = ({ item }: { item: any }) => (
    <View
      className={`border border-black/50 px-4 py-2 mb-2 mt-2 w-4/5 rounded-2xl
        ${item.senderId === currentUserId ?
          'bg-sky-100 ml-auto rounded-br-sm' :
          'bg-gray-100 rounded-tl-sm'}
      `}
    >
      <View className='flex-row border border-transparent justify-between mb-1'>
        <Text className='text-sm font-pmedium text-gray-500'>
          {item.senderId === currentUserId ? 'You' : otherUserName.split(' ')[0]}
        </Text>
        <Text className='text-xs font-pmedium text-gray-500'>
          {new Date(item.timestamp?.toDate()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })}
        </Text>
      </View>
      <Text className='text-lg font-pregular'>{item.text}</Text>
    </View>
  )

  return (
    <SafeAreaView className='bg-white flex-1'>
      <View className='flex-row items-center border-b border-gray-200'>
        <TouchableOpacity className='p-5' onPress={() => router.back()}>
          <MaterialCommunityIcons name='arrow-left' size={28} />
        </TouchableOpacity>
        <Text className='text-2xl font-encode ml-3' numberOfLines={1}>{otherUserName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        inverted={true}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        className='px-4 flex-1'
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
        onContentSizeChange={() => {
          if (initialLoad) {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
          }
        }}
      />

      <View className='flex-row items-center justify-center gap-4 py-4 border-t border-gray-200 mx-4'>
        <TextInput
          className='flex-1 w-full h-full text-xl font-pregular border-2 rounded-xl p-2 px-4'
          value={newMessage}
          keyboardType='default'
          placeholder='Message'
          placeholderTextColor={'#7b7b8b'}
          onChangeText={setNewMessage}
          numberOfLines={3}
          multiline={true}
        />
        <TouchableOpacity
          onPress={handleSend}
          className='border-2 items-center justify-center rounded-xl p-4 ml-[-2px] bg-sky-100'
        >
          <MaterialCommunityIcons name='send' size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Chat