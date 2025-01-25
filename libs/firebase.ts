import { auth, db } from "@/configs/firebase-config";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithCredential } from "@firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name && user) {
      await updateProfile(user, {
        displayName: name,
        photoURL: `https://res.cloudinary.com/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1735838114/pairglide/profilepictures/default.png`,
      })
    }

    const token = await user.getIdToken();
    await AsyncStorage.setItem('token', token);

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      address: '',
      location: {
        long: "0",
        lat: "0",
      },
      skills: [],
      photoUrl: user.photoURL || `https://res.cloudinary.com/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1735838114/pairglide/profilepictures/default.png`,
      hasCompletedOnboarding: false,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = await user.getIdToken();
    await AsyncStorage.setItem('token', token);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const signInWithGoogle = async () => {
  try {
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    const googleCredential = GoogleAuthProvider.credential(idToken);

    const authUser = await signInWithCredential(auth, googleCredential);

    const user = authUser.user

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: user.displayName,
        email: user.email,
        address: '',
        location: {
          long: "0",
          lat: "0",
        },
        skills: [],
        photoUrl: user.photoURL || `default-photo-url`,
        hasCompletedOnboarding: false,
      });
      return user;
    } else {
      const userData = docSnap.data();
      if (!userData.hasCompletedOnboarding) {
        return user;
      }
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google: ', error);
    throw error;
  }
};

export const logOut = async (userId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      expoPushToken: null,
    });
    await signOut(auth);
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const googleLogout = () => {
  try {
    GoogleSignin.revokeAccess()
    GoogleSignin.signOut()
  } catch (error) {
    console.error('Error signing out with Google: ', error);
  }
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const user = auth.currentUser;
      if (user) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getUserInfo = async (userId: any) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No such document!");
      return null
    }

    return docSnap.data();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const searchUsers = async (skills: string | string[]) => {
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("skills", "array-contains-any", skills));

  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return users;
}

export const updateProfilePicture = async (file: any, user: any) => {
  const formData = new FormData();

  const imageFile = {
    uri: file.uri,
    type: 'image/jpeg',
    name: file.uri.split('/').pop() || 'photo.jpg',
  };

  formData.append('file', imageFile);
  formData.append('upload_preset', 'native');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data || !response.data.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }

    const url = response.data.secure_url;

    await updateProfile(user, {
      photoURL: url,
    })

    await updateDoc(doc(db, "users", user.uid), {
      photoUrl: url,
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateSkills = async (skills: string[], user: any) => {
  try {
    await updateDoc(doc(db, "users", user.uid), {
      skills: skills,
    });

    await updateDoc(doc(db, "users", user.uid), {
      hasCompletedOnboarding: true
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateLocation = async (address: string, long: string, lat: string, user: any) => {
  try {
    await updateDoc(doc(db, "users", user.uid), {
      address,
      location: {
        long,
        lat,
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}