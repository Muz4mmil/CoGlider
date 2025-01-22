import React from 'react'
import { Stack } from 'expo-router'

const EditProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='skills' options={{ headerShown: false }} />
      <Stack.Screen name='location' options={{ headerShown: false }} />
      <Stack.Screen name='profile' options={{ headerShown: false }} />
    </Stack>
  )
}

export default EditProfileLayout