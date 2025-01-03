import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'
import React from 'react'
import Button from '@/components/Button'

type SkillsScreenProps = {
  selectedSkills: string[]
  toggleSkill: (skill: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredSkills: string[]
  skillsList: Record<string, string[]>
  loading: boolean
  handleSkillsUpdate: () => void
  handleScreenChange: (screen: number) => void
}

export const SkillsScreen = ({
  selectedSkills,
  toggleSkill,
  searchQuery,
  setSearchQuery,
  filteredSkills,
  skillsList,
  loading,
  handleSkillsUpdate,
  handleScreenChange
}: SkillsScreenProps) => {
  return (
    <View className='flex-1 px-4'>
      <View className=''>
        <Text className='font-psemibold text-xl text-center mt-10'>Select Your Skills</Text>
        
        <View className='mt-6'>
          <TextInput
            placeholder="Search skills..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className='border border-gray-700 rounded-xl py-3 px-4 '
          />
        </View>

        <View className='mt-6 flex-row flex-wrap gap-2'>
          {selectedSkills.map((skill) => (
            <Pressable 
              key={skill}
              onPress={() => toggleSkill(skill)}
              className='bg-amber-100 py-2 px-4 rounded-xl flex-row items-center'
            >
              <Text className='font-psemibold'>{skill}</Text>
              <Text className='ml-2 font-bold'>×</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView 
        className='mt-6' 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {searchQuery ? (
          <View className='flex-row flex-wrap gap-2'>
            {filteredSkills.map((skill) => (
              <Pressable 
                key={skill}
                onPress={() => toggleSkill(skill)}
                className={`py-2 px-4 rounded-xl border ${
                  selectedSkills.includes(skill) 
                    ? 'bg-amber-100' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className='font-psemibold'>{skill}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          Object.entries(skillsList).map(([category, skills]) => (
            <View key={category} className='mt-6'>
              <Text className='font-psemibold text-lg mb-3'>{category}</Text>
              <View className='flex-row flex-wrap gap-2'>
                {skills.map((skill) => (
                  <Pressable 
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    className={`py-2 px-4 rounded-xl border ${
                      selectedSkills.includes(skill) 
                        ? 'bg-amber-100 border-amber-200' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className='font-psemibold'>{skill}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View className='pb-6 pt-4 border-t border-gray-200'>
        <View className='flex-row gap-4'>
          <Button 
            title="Back" 
            containerStyles='flex-1 bg-white' 
            handlePress={() => handleScreenChange(1)} 
          />
          <Button 
            title="Next" 
            containerStyles='flex-1 bg-amber-200' 
            handlePress={handleSkillsUpdate}
            disabled={selectedSkills.length === 0}
            loading={loading}
          />
        </View>
      </View>
    </View>
  )
}