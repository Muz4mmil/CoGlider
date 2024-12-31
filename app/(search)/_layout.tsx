import { Stack } from "expo-router"
import { Text } from "react-native"

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="search-form"
        options={{
          title: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerTitle: () => (
            <Text className="text-2xl font-encode">Results</Text>
          ),
          headerShadowVisible: false
        }}
      />
    </Stack>
  )
}

export default _layout