import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchResults } from '@/libs/fetchResults';
import TinderCard from 'react-tinder-card';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Button from '@/components/Button';
import { createRoom } from '@/libs/firebase-messaging';
import images from '@/constants/images';

interface IUserInfo {
  id: string
  name: string
  email: string
  photoUrl: string
  hasCompletedOnboarding: boolean
  address: string
  location: {
    long: string
    lat: string
  }
  skills: string[]
  distance: number
  cardColor?: string
}

const Results = () => {
  const { user, userInfo } = useGlobalContext();
  const { skills, projectDetails } = useLocalSearchParams();
  const skillsArray = typeof skills === 'string' ? skills.split(',') : skills;
  const [matchingUsers, setMatchingUsers] = useState<IUserInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [swipedAll, setSwipedAll] = useState(false);

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(matchingUsers.length)
        .fill(0)
        .map(() => React.createRef()),
    [matchingUsers.length]
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const results = await fetchResults(skillsArray, userInfo);
      const cardsColor = ['#fee2e2', '#e0f2fe', '#fef3c7'];

      const resultsWithColors = results
        .filter(user => userInfo?.email !== user.email)
        .map((user, index) => ({
          ...user,
          cardColor: cardsColor[index % cardsColor.length]
        }));

      setMatchingUsers(resultsWithColors);
      setCurrentIndex(resultsWithColors.length - 1);
      currentIndexRef.current = resultsWithColors.length - 1;
      setSwipedAll(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skills && userInfo) {
      fetchUsers();
    }
  }, []);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < matchingUsers.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, idToDelete: string, index: number) => {
    updateCurrentIndex(index - 1);
    if (index === 0) {
      setSwipedAll(true);
    }
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`);
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < matchingUsers.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleChatClick = async (userId: string, name: string) => {
    setButtonLoading(true);
    if (user) {
      const roomId = await createRoom(user.uid, userId);
      router.push({
        pathname: '/chat/[chatId]',
        params: {
          chatId: roomId,
          currentUserId: user.uid,
          otherUserId: userId,
          otherUserName: name
        }
      });
      setButtonLoading(false);
    } else {
      console.error('Failed to start chat');
      setButtonLoading(false);
    }
  };

  const renderCard = (user: IUserInfo, index: number) => {
    if (!user) return null;

    return (
      <TinderCard
        ref={childRefs[index]}
        key={user.id}
        onSwipe={(dir) => swiped(dir, user.id, index)}
        onCardLeftScreen={() => outOfFrame(user.name, index)}
      >
        <View
          style={{ backgroundColor: user.cardColor }}
          className="h-[70vh] rounded-3xl border-2 p-6 shadow-xl items-center absolute w-full"
        >
          <Image
            source={{ uri: user.photoUrl }}
            className="h-40 w-40 rounded-3xl border-2 border-black bg-gray-100"
          />

          <Text className="mt-4 text-2xl font-pbold text-center text-gray-900">{user.name}</Text>

          <View className="w-full mt-6">
            <View className="flex-row justify-between">
              <Text className="text-lg font-psemibold text-gray-700">Skills:</Text>
              <Text className="font-pmedium text-gray-700">5 matched</Text>
            </View>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {user.skills.map((skill, idx) => (
                <View key={idx} className="rounded-lg bg-white px-3 py-1">
                  <Text className="font-pregular text-sm">{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="w-full mt-10">
            <View className="flex-row justify-between">
              <Text className="text-lg font-psemibold text-gray-700">Address:</Text>
              <Text className="font-pmedium text-gray-700">{user.distance.toFixed(1)} km away</Text>
            </View>
            <Text className='font-pregular mt-2'>{user.address}</Text>
          </View>

          <Button
            title='Chat'
            handlePress={() => handleChatClick(user.id, user.name)}
            loading={buttonLoading}
            containerStyles='bg-white w-full mt-auto rounded-xl'
          />
        </View>
      </TinderCard>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={'black'} />
      </View>
    );
  }

  if (matchingUsers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl">No matches found</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          activeOpacity={0.7}
          className="border-2 border-black rounded-3xl py-4 px-4 mt-3"
        >
          <MaterialCommunityIcons name="refresh" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  if (swipedAll) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-xl">OH oh!, No more matches found</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          activeOpacity={0.7}
          className="border-2 border-black rounded-3xl py-4 px-4 mt-3"
        >
          <MaterialCommunityIcons name="refresh" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Text className="mt-8 text-center text-2xl font-semibold">
        Find your perfect Project Partner
      </Text>

      <View style={{ height: Dimensions.get('window').height * 0.7 }} className="relative mt-4">
        <View className="flex-row justify-between items-center px-8 mb-4">
          {/* <TouchableOpacity onPress={() => swipe('left')} disabled={!canSwipe}>
              <Text className="text-sm font-pregular text-center text-gray-500">Prev</Text>
            </TouchableOpacity> */}
          <View className='flex-row'>
            <MaterialCommunityIcons name="gesture-swipe" size={16} color="gray" />
            <TouchableOpacity onPress={() => swipe('right')} disabled={!canSwipe}>
              <Text className="text-sm font-pregular text-center text-gray-500 ml-2">Swipe for next</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={goBack}
            disabled={!canGoBack}
            className=""
          >
            <Text className={`${!canGoBack ? 'text-gray-300' : 'text-black'}`}>Undo</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-4">
          {matchingUsers.map((user, index) => renderCard(user, index))}
        </View>


      </View>
    </ScrollView>
  );
};

export default Results;