import { View, Text, ScrollView, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useMemo, useState } from 'react';
import { allSkills } from '@/constants/skills';
import Button from '@/components/Button';
import { router } from 'expo-router';

const SearchForm = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      return [...prev, skill];
    });
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return [];
    return allSkills
      .filter(
        (skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedSkills.includes(skill)
      )
      .slice(0, 5);
  }, [searchQuery, selectedSkills]);

  const dismissKeyboardAndSuggestions = () => {
    Keyboard.dismiss();
    setShowSuggestions(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={(event) => {
        const { locationY } = event.nativeEvent;
        if (locationY > 200) { // Adjust height based on UI layout
          dismissKeyboardAndSuggestions();
        }
      }}
    >
      <View className='flex-1'>
        <ScrollView className="bg-white h-full px-4 flex-1">
          <Text className="font-psemibold text-2xl text-center mt-0">
            Enter your Project Details
          </Text>
          <Text className="font-pregular text-center mt-10 px-4">
            These details will be shown to your partner and they can decide whether to accept or not...
          </Text>
          <View className="mt-10">
            <Text className="font-pmedium text-lg">Project Details</Text>
            <TextInput
              className="border h-40 align-text-top border-gray-500 mt-2 p-4 rounded-xl"
              placeholder="Enter your Project Title"
              numberOfLines={10}
              value={projectDetails}
              onChangeText={setProjectDetails}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          <View className="mt-5">
            <Text className="font-pmedium text-lg">Select Your Skills</Text>
            <View className="mt-2 relative">
              <TextInput
                placeholder="Search skills..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="border border-gray-500 rounded-xl py-3 px-4"
              />
              {showSuggestions && filteredSkills.length > 0 && (
                <View className="absolute bottom-full left-0 right-0 shadow-lg shadow-black bg-white border border-gray-300 rounded-lg mb-2 z-10">
                  {filteredSkills.map((skill) => (
                    <Pressable
                      key={skill}
                      onPress={() => toggleSkill(skill)}
                      className="py-3 px-4 border-b border-gray-200"
                    >
                      <Text className="font-pmedium">{skill}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Pressable
                  key={skill}
                  onPress={() => toggleSkill(skill)}
                  className="bg-sky-100 py-1 px-4 rounded-lg flex-row items-center"
                >
                  <Text className="font-pmedium">{skill}</Text>
                  <Text className="ml-2 font-bold">×</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
        <View className='mt-auto p-4 pb-8 bg-white'>
          <Button
            title="Search"
            containerStyles="bg-sky-200"
            disabled={selectedSkills.length === 0 || !projectDetails}
            handlePress={() => router.push({ pathname: '/results', params: { skills: selectedSkills, projectDetails } })}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchForm;