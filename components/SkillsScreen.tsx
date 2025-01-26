import { View, Text, ScrollView, Pressable, TextInput, Keyboard, FlatList, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useMemo, useRef } from 'react'
import Button from '@/components/Button'

type SkillsScreenProps = {
  selectedSkills: string[]
  toggleSkill: (skill: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  skillsList: Record<string, string[]>
  loading: boolean
  handleSkillsUpdate: () => void
  handleScreenChange: (screen: number) => void
  fromEdit?: boolean
}

export const SkillsScreen = ({
  selectedSkills,
  toggleSkill,
  searchQuery,
  setSearchQuery,
  skillsList,
  loading,
  handleSkillsUpdate,
  handleScreenChange,
  fromEdit
}: SkillsScreenProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const selectedSkillsScrollViewRef = useRef<ScrollView>(null);

  const allSkills = useMemo(() => {
    return Object.values(skillsList).flat();
  }, [skillsList]);

  const renderDropdownItem = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => {
        toggleSkill(item);
        setIsDropdownVisible(false);
        setSearchQuery('');
        setTimeout(() => {
          selectedSkillsScrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }}
      className='py-3 px-4 border-b border-gray-200'
    >
      <Text className='font-pmedium text-base'>{item}</Text>
    </Pressable>
  );

  const filteredDropdownSkills = allSkills.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 px-4'>
        <View>
          <Text className='font-psemibold text-xl text-center mt-10'>
            Select Your Skills
          </Text>

          <View className='mt-6 relative z-50'>
            <TextInput
              placeholder="Search skills..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setIsDropdownVisible(text.length > 0);
              }}
              onFocus={() => {
                if (searchQuery.length > 0) {
                  setIsDropdownVisible(true);
                }
              }}
              className='border border-gray-700 rounded-xl py-3 px-4'
            />

            {isDropdownVisible && (
              <View
                className='absolute top-full w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-64'
                pointerEvents="box-none"
              >
                <FlatList
                  data={filteredDropdownSkills}
                  renderItem={renderDropdownItem}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps='handled'
                  ListEmptyComponent={
                    <View className='py-4 items-center'>
                      <Text className='text-gray-500'>No skills found</Text>
                    </View>
                  }
                />
              </View>
            )}
          </View>

          {selectedSkills.length > 0 && (
            <View>
              <Text className='font-psemibold text-base mt-4 mb-2'>
                Selected Skills
              </Text>
              <ScrollView
                ref={selectedSkillsScrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={true}
                className='max-h-20 pb-2'
              >
                <View className='flex-row flex-wrap gap-2'>
                  {selectedSkills.map(skill => (
                    <Pressable
                      key={skill}
                      onPress={() => {
                        toggleSkill(skill)
                        setTimeout(() => {
                          selectedSkillsScrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                      }}
                      className={`py-2 px-4 rounded-xl border ${selectedSkills.includes(skill)
                        ? 'bg-amber-100 border-amber-200'
                        : 'bg-white border-gray-300'
                        } flex-row items-center`}
                    >
                      <Text className='font-pmedium text-sm'>{skill}</Text>
                      {selectedSkills.includes(skill) && (
                        <Text className='ml-2 font-medium'>×</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        <View className='my-3 border-t border-gray-300' />

        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {Object.entries(skillsList).map(([category, skills]) => (
            <View key={category} className='mb-4'>
              <Text className='font-psemibold text-lg mb-3'>{category}</Text>
              <View className='flex-row flex-wrap gap-2'>
                {skills.map(skill => (
                  <Pressable
                    key={skill}
                    onPress={() => {
                      toggleSkill(skill)
                      setTimeout(() => {
                        selectedSkillsScrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 100);
                    }}
                    className={`py-2 px-4 rounded-xl border ${selectedSkills.includes(skill)
                      ? 'bg-amber-100 border-amber-200'
                      : 'bg-white border-gray-300'
                      } flex-row items-center`}
                  >
                    <Text className='font-pmedium text-sm'>{skill}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        <View className='pb-6 pt-4 border-t border-gray-200'>
          <View className='flex-row gap-4'>
            <Button
              title={fromEdit ? "Cancel" : "Back"}
              containerStyles='flex-1 bg-white'
              handlePress={() => handleScreenChange(1)}
            />
            <Button
              title={fromEdit ? "Update" : "Next"}
              containerStyles="flex-1 bg-amber-200"
              handlePress={handleSkillsUpdate}
              disabled={selectedSkills.length === 0}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}