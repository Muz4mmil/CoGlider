import { auth, db } from "@/configs/firebase-config";
import { getUserInfo, logOut, resetPassword, signIn, signUp } from "@/libs/firebase";
import { signInWithGoogle } from "@/libs/firebase";
import { User } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { doc, DocumentData, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  user: User | null;
  userInfo: DocumentData | undefined;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<User | void>;
  signin: (email: string, password: string) => Promise<User | void>;
  signinWithGoogle: () => Promise<User | void>;
  logout: () => Promise<void>;
  resetpassword: (email: string) => Promise<void>;
  updateUserData: (id: string) => Promise<void>
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  userInfo: undefined,
  loading: true,
  signup: async () => { },
  signin: async () => { },
  signinWithGoogle: async () => { },
  logout: async () => { },
  resetpassword: async () => { },
  updateUserData: async () => { }
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

  const updateUserData = async (id: string) => {
    const data = await getUserInfo(id);
    await AsyncStorage.setItem('userInfo', JSON.stringify(data))
    setUserInfo(data);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setLoading(true);
      try {
        if (authUser) {
          setUser(authUser);
          await fetchStoredUserInfo();
          // const data = await getUserInfo(authUser.uid);
          // setUserInfo(data);
          await updateUserData(authUser.uid)
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
      // const data = await getUserInfo(newUser.uid);
      // setUserInfo(data);
      await updateUserData(newUser.uid)
      return newUser;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signinWithGoogle = async () => {
    try {
      const newUser = await signInWithGoogle();
      if (newUser) {
        // const data = await getUserInfo(newUser.uid);
        // setUserInfo(data);
        setUser(newUser);
        // await updateUserData(newUser.uid)
        return newUser;
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const newUser = await signUp(name, email, password);
      setUser(newUser);
      // const data = await getUserInfo(newUser.uid);
      // setUserInfo(data);
      await updateUserData(newUser.uid)
      return newUser;
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await logOut(user.uid);
        setUser(null);
        setUserInfo(undefined);
        await AsyncStorage.removeItem('userInfo');
        router.replace({
          pathname: "/",
          params: {
            reset: "true"
          }
        });
      }
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
        signinWithGoogle,
        signup,
        logout,
        resetpassword,
        updateUserData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;