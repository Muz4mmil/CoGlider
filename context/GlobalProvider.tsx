import { auth, db } from "@/configs/firebase-config";
import { getUserInfo, logOut, resetPassword, signIn, signUp } from "@/libs/firebase";
import { signInWithGoogle } from "@/libs/firebase";
import { User } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { doc, DocumentData } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  user: User | null;
  userInfo: DocumentData | undefined;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signinWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetpassword: (email: string) => Promise<void>;
  updateUserData: (id: string) => Promise<DocumentData | null>;
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  userInfo: undefined,
  loading: true,
  signup: async () => {},
  signin: async () => {},
  signinWithGoogle: async () => {},
  logout: async () => {},
  resetpassword: async () => {},
  updateUserData: async (id: string) => null,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<DocumentData | undefined>();

  const fetchStoredUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
        return parsedUserInfo;
      }
      return null;
    } catch (error) {
      console.error('Error fetching stored user info:', error);
      return null;
    }
  };

  const updateUserData = async (id: string) => {
    try {
      const data = await getUserInfo(id);
      if (data) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error updating user data:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (authUser: User | null) => {
    setLoading(true);
    try {
      if (authUser) {
        setUser(authUser);
        const userData = await updateUserData(authUser.uid);
        
        if (userData) {
          console.log('routing from auth listner')
          if (!userData.hasCompletedOnboarding) {
            router.replace("/onboard");
          } else {
            router.replace("/home");
          }
        }
      } else {
        setUser(null);
        setUserInfo(undefined);
        await AsyncStorage.removeItem('userInfo');
        router.replace("/");
      }
    } catch (error) {
      console.error('Error in auth state change:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
    return () => unsubscribe();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const newUser = await signIn(email, password);
      setUser(newUser);
      await updateUserData(newUser.uid);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signinWithGoogle = async () => {
    try {
      const newUser = await signInWithGoogle();
      if (newUser) {
        setUser(newUser);
        await updateUserData(newUser.uid);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const newUser = await signUp(name, email, password);
      setUser(newUser);
      await updateUserData(newUser.uid);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await logOut(user.uid);
        setUser(null);
        setUserInfo(undefined);
        await AsyncStorage.removeItem('userInfo');
        router.replace("/");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const resetpassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        userInfo,
        loading,
        signin,
        signinWithGoogle,
        signup,
        logout,
        resetpassword,
        updateUserData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;