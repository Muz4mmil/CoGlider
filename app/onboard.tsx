import { View, Text, Dimensions, Alert } from 'react-native'
import React, { useState, useRef, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import * as Animatable from 'react-native-animatable'
import { ProfilePictureScreen } from '@/components/ProfilePictureScreen'
import { SkillsScreen } from '@/components/SkillsScreen'
import { LocationScreen } from '@/components/LocationScreen'
import { skillsList, allSkills } from '@/constants/skills'
import { updateLocation, updateProfilePicture, updateSkills } from '@/libs/firebase'
import { router } from 'expo-router'
import { ImagePickerAsset } from 'expo-image-picker'

const { width } = Dimensions.get('window')

const OnBoard = () => {
  const { user } = useGlobalContext()
  const [currentScreen, setCurrentScreen] = useState(1)
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState({ long: '0', lat: '0' })
  const [loading, setLoading] = useState(false)

  const screen1Ref = useRef<Animatable.View & { animate: any }>(null)
  const screen2Ref = useRef<Animatable.View & { animate: any }>(null)
  const screen3Ref = useRef<Animatable.View & { animate: any }>(null)

  const handleImageUpdate = async () => {
    if (selectedImage) {
      setLoading(true)
      try {
        const result = await updateProfilePicture(selectedImage, user)
        if (result) {
          handleScreenChange(2)
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSkillsUpdate = async () => {
    if (selectedSkills.length > 0) {
      setLoading(true)
      try {
        const result = await updateSkills(selectedSkills, user)
        if (result) {
          handleScreenChange(3)
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleLocationUpdate = async () => {
    if (location.long !== '0' && location.lat !== '0') {
      setLoading(true)
      try {
        const result = await updateLocation(location.long, location.lat, user)
        if (result) {
          setLoading(false)
          router.push('/home')
        }
      } catch (error) {
        setLoading(false)
        Alert.alert('Error', (error as Error).message)
      }
    }
  }

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return allSkills
    return allSkills.filter(skill =>
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill)
      }
      return [...prev, skill]
    })
  }

  const animateScreenChange = (current: number, next: number) => {
    const getRef = (screen: number) => {
      switch (screen) {
        case 1: return screen1Ref
        case 2: return screen2Ref
        case 3: return screen3Ref
      }
    }

    const isForward = next > current

    getRef(current)?.current?.animate({
      0: { translateX: 0 },
      1: { translateX: isForward ? -width : width }
    }, 300)

    getRef(next)?.current?.animate({
      0: { translateX: isForward ? width : -width },
      1: { translateX: 0 }
    }, 300)
  }

  const handleScreenChange = (nextScreen: number) => {
    animateScreenChange(currentScreen, nextScreen)
    setCurrentScreen(nextScreen)
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="mt-10">
        <Text className="text-center font-encode text-3xl">Welcome</Text>
        <Text className="text-center font-encode text-3xl">{user?.displayName?.split(' ')[0]}</Text>
      </View>

      <Text className="font-encode text-xl text-center mt-5">Let's get you onboard</Text>

      <View className="flex-1 relative">
        <Animatable.View
          ref={screen1Ref}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: [{ translateX: currentScreen === 1 ? 0 : width }]
          }}
        >
          <ProfilePictureScreen
            user={user}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleScreenChange={handleScreenChange}
            handleImageUpdate={handleImageUpdate}
            loading={loading}
          />
        </Animatable.View>

        <Animatable.View
          ref={screen2Ref}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: [{ translateX: currentScreen === 2 ? 0 : width }]
          }}
        >
          <SkillsScreen
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredSkills={filteredSkills}
            skillsList={skillsList}
            loading={loading}
            handleSkillsUpdate={handleSkillsUpdate}
            handleScreenChange={handleScreenChange}
          />
        </Animatable.View>

        <Animatable.View
          ref={screen3Ref}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: [{ translateX: currentScreen === 3 ? 0 : width }]
          }}
        >
          <LocationScreen
            location={location}
            setLocation={setLocation}
            loading={loading}
            handleLocationUpdate={handleLocationUpdate}
            handleScreenChange={handleScreenChange}
          />
        </Animatable.View>
      </View>
    </SafeAreaView>
  )
}

export default OnBoard