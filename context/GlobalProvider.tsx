import { auth } from "@/configs/firebase-config";
import { getUserInfo, logOut, resetPassword, signIn, signUp } from "@/libs/firebase";
import { User } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { DocumentData } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  user: User | null;
  userInfo: DocumentData | undefined;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<User | void>;
  signin: (email: string, password: string) => Promise<User | void>;
  logout: () => Promise<void>;
  resetpassword: (email: string) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  userInfo: undefined,
  loading: true,
  signup: async () => { },
  signin: async () => { },
  logout: async () => { },
  resetpassword: async () => { }
})

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<DocumentData | undefined>();

  const fetchStoredUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error('Error fetching stored user info:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setLoading(true);
      try {
        if (authUser) {
          setUser(authUser);
          await fetchStoredUserInfo();
          const data = await getUserInfo(authUser.uid);
          setUserInfo(data);
        } else {
          setUser(null);
          setUserInfo(undefined);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const newUser = await signIn(email, password);
      setUser(newUser);
      const data = await getUserInfo(newUser.uid);
      setUserInfo(data);
      return newUser;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const newUser = await signUp(name, email, password);
      setUser(newUser);
      const data = await getUserInfo(newUser.uid);
      setUserInfo(data);
      return newUser;
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const logout = async () => {
    try {
      await logOut();
      setUser(null);
      setUserInfo(undefined);
      await AsyncStorage.removeItem('userInfo');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
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

  useEffect(() => {
    console.log('User Info:', userInfo);
  }, [userInfo]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        userInfo,
        loading,
        signin,
        signup,
        logout,
        resetpassword,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
