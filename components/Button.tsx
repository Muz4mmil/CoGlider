import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ButtonProps {
  containerStyles?: string;
  textStyles?: string;
  title: string;
  handlePress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button = ({ containerStyles, textStyles, title, handlePress, loading, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      className={`border-2 shadow-lg shadow-black/60 border-black rounded-3xl py-5 ${disabled && 'opacity-30' } ${containerStyles}`}
      onPress={handlePress}
    >
      {!loading ?
      <Text className={`text-center font-pmedium text-xl ${textStyles}`}>
        {title}
      </Text> : 
      <ActivityIndicator size="small" color="#000" />
      }
    </TouchableOpacity>
  )
}

export default Button
