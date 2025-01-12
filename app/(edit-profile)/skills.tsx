import { View, Text, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SkillsScreen } from '@/components/SkillsScreen'
import { allSkills, skillsList } from '@/constants/skills'
import { useGlobalContext } from '@/context/GlobalProvider'
import { updateSkills } from '@/libs/firebase'
import { router } from 'expo-router'

const UpdateSkills = () => {
  const { user, userInfo } = useGlobalContext()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSelectedSkills(userInfo?.skills)
  }, [])

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

  const handleSkillsUpdate = async () => {
    if (selectedSkills.length > 0) {
      setLoading(true)
      try {
        const result = await updateSkills(selectedSkills, user)
        if (result) {
          router.back()
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }
  }
  
  return (
    <SafeAreaView className='bg-white flex-1'>
      <Text className='font-encode text-2xl mt-8 text-center'>Update Your SKills</Text>
      <SkillsScreen
        selectedSkills={selectedSkills}
        toggleSkill={toggleSkill}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredSkills={filteredSkills}
        skillsList={skillsList}
        loading={loading}
        handleSkillsUpdate={handleSkillsUpdate}
        handleScreenChange={() => router.back()}
        fromEdit={true}
      />
    </SafeAreaView>
  )
}

export default UpdateSkills