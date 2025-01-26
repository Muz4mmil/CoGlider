import { ActivityIndicator, Animated, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import InputField from "@/components/InputField";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { loading, user, userInfo, signup, signin, signinWithGoogle } = useGlobalContext();
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(currentScreen === "welcome" ? 1.5 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(currentScreen === "welcome" ? 40 : 0)).current;

  useEffect(() => {
    const scaleAnimation = Animated.timing(scaleAnim, {
      toValue: currentScreen === "welcome" ? 1.5 : 1,
      duration: 500,
      useNativeDriver: true,
    });

    const translateAnimation = Animated.timing(translateYAnim, {
      toValue: currentScreen === "welcome" ? 40 : 0,
      duration: 500,
      useNativeDriver: true,
    });

    Animated.parallel([scaleAnimation, translateAnimation]).start();
  }, [currentScreen]);

  if (loading) {
    return (
      <View className="flex-1 bg-white h-full w-full items-center justify-center">
        <ActivityIndicator size={50} color={"#0284c7"} />
      </View>
    );
  }

  if (user) {
    if (userInfo) {
      console.log("Routing from index")
      if (!userInfo.hasCompletedOnboarding) {
        return <Redirect href="/onboard" />;
      }
      return <Redirect href="/home" />;
    }

    return (
      <View className="flex-1 bg-white h-full w-full items-center justify-center">
        <ActivityIndicator size={50} color={"#0284c7"} />
      </View>
    );
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (currentScreen === "signup") {
        if (!form.name || !form.email || !form.password) {
          setError('All fields are required');
          return;
        }

        await signup(form.name, form.email, form.password);
      } else {
        if (!form.email || !form.password) {
          setError('All fields are required');
          return;
        }
        await signin(form.email, form.password);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSignInLoading(true);
    setError("");

    try {
      await signinWithGoogle();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setGoogleSignInLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white justify-center items-center">
      <ScrollView className="w-full px-4">
        <Animated.View
          className="mb-10 mt-14 items-center justify-center"
          style={{
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          }}
        >
          <Text className="text-2xl font-encode">Welcome To</Text>
          <Text className="text-4xl font-encode">CoGlider</Text>
        </Animated.View>

        {currentScreen === "welcome" ? (
          <View className="mt-16">
            <Image source={images.welcome} className="w-full h-80" resizeMode="cover" />

            <Text className="w-4/5 text-xl font-pregular mx-auto text-center mt-5">
              Find your perfect project partner or like-minded talent near you & bring your ideas to life.
            </Text>

            <Button
              title="Get Started"
              containerStyles="mt-10 w-full bg-sky-200"
              handlePress={() => setCurrentScreen("signup")}
            />
          </View>
        ) : (
          <Animatable.View animation="fadeInUp" duration={500} delay={300}>
            <Text className="text-3xl font-encode mb-8">
              {currentScreen === "signup" ? "Create a new Account" : "Log in your Account"}
            </Text>

            <View className="gap-4 relative">
              {currentScreen === "signup" && (
                <InputField
                  title="Name"
                  value={form.name}
                  handleChange={(e) => setForm({ ...form, name: e })}
                  placeholder="Enter your name"
                />
              )}
              <InputField
                title="Email"
                value={form.email}
                handleChange={(e) => setForm({ ...form, email: e })}
                placeholder="Enter your Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                title="Password"
                value={form.password}
                handleChange={(e) => setForm({ ...form, password: e })}
                autoCapitalize="none"
                placeholder="Enter a strong Password"
              />
              {error && <Text className="absolute -bottom-8 left-2 text-red-500 mt-4">{error}</Text>}
            </View>

            <Button
              title={currentScreen === "signup" ? "Sign Up" : "Log In"}
              containerStyles="mt-12 w-full bg-sky-200"
              loading={isLoading}
              disabled={isLoading}
              handlePress={handleSubmit}
            />

            <View className="flex-row justify-center gap-5 mt-4">
              <Text className="text-center mt-4 font-pregular border border-white">
                {currentScreen === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Text>
              <Text
                className="text-center mt-4 font-psemibold underline text-sky-600"
                onPress={() => {
                  setCurrentScreen(currentScreen === "signup" ? "login" : "signup");
                  setError("");
                }}
              >
                {currentScreen === "signup" ? "Login" : "Signup"}
              </Text>
            </View>

            <View className="relative h-[1px] border-b border-gray-300 mt-5 mb-8">
              <Text className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500">or</Text>
            </View>

            <TouchableOpacity
              disabled={googleSignInLoading}
              activeOpacity={0.7}
              className={`border-2 bg-white shadow-lg shadow-black/60 border-black rounded-3xl justify-center h-[60px] ${googleSignInLoading && 'opacity-30'}`}
              onPress={handleGoogleSignIn}
            >
              {!googleSignInLoading ?
                <View className="flex-row items-center justify-center gap-4">
                  <Image source={images.googleLogo} className="h-8 w-8" />
                  <Text className="text-center font-pmedium text-xl">
                    Continue with Google
                  </Text>
                </View> :
                <ActivityIndicator size="small" color="#000" />
              }
            </TouchableOpacity>
          </Animatable.View>
        )}
      </ScrollView>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}