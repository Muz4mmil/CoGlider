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
  updateUserInfo: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  userInfo: undefined,
  loading: false,
  signup: async () => { },
  signin: async () => { },
  logout: async () => { },
  resetpassword: async () => { },
  updateUserInfo: async () => { }
})

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<DocumentData | undefined>()

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            setUser(user)
            await updateUserInfo()
            setLoading(false)
          } else {
            setUser(null)
            setLoading(false)
          }
        })

        return () => unsubscribe()
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const signin = async (email: string, password: string) => {
    try {
      const newuser = await signIn(email, password)
      setUser(newuser)
      return newuser

    } catch (error) {
      console.log(error)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const newuser = await signUp(name, email, password)
      setUser(newuser)
      return newuser

    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    try {
      await logOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const resetpassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateUserInfo = async () => {
    if (user) {
      await getUserInfo(user.uid).then((data) => {
        setUserInfo(data)
        AsyncStorage.setItem('userInfo', JSON.stringify(data));
      })
    }
  }

  return (
    <GlobalContext.Provider value={{
      user,
      userInfo,
      loading,
      signin,
      signup,
      logout,
      resetpassword,
      updateUserInfo
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider;