import { View, Text, TextInput, TouchableOpacity, Image, KeyboardTypeOptions } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface InputFieldProps {
  title: string,
  value: string,
  handleChange: (e: any) => void,
  otherStyles?: string,
  keyboardType?: KeyboardTypeOptions,
  placeholder?: string,
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined
}

const InputField = ({ title, value, placeholder, handleChange, otherStyles, keyboardType, autoCapitalize, ...props }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-gray-700 text-base font-pmedium'>{title}</Text>

      <View className="border-2 border-black-200 h-16 w-full bg-black-100 rounded-2xl pl-4 focus:border-secondary items-center flex-row">
        <TextInput
          className='flex-1 w-full h-full text-xl mt-0.5 font-pmedium'
          value={value}
          keyboardType={keyboardType || 'default'}
          placeholder={placeholder}
          placeholderTextColor={'#7b7b8b'}
          onChangeText={handleChange}
          secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword}
          autoCapitalize={autoCapitalize || 'sentences'}
        />

        {(title === 'Password' || title === 'Confirm Password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className='p-4'>
            {!showPassword ?
              <MaterialCommunityIcons name="eye-outline" size={24} color="black" />
              : <MaterialCommunityIcons name="eye-off-outline" size={24} color="black" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default InputField