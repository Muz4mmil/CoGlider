import { auth, db } from "@/configs/firebase-config";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "@firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cloudinary from "@/configs/cloudinary-config";
import { upload } from 'cloudinary-react-native'


export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name && user) {
      await updateProfile(user, {
        displayName: name,
        photoURL: 'https://res.cloudinary.com/dsccpsoaw/image/upload/v1735838114/pairglide/profilepictures/default.png',
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
      photoUrl: user.photoURL || 'https://res.cloudinary.com/dsccpsoaw/image/upload/v1735838114/pairglide/profilepictures/default.png',
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

export const logOut = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log(error);
    throw error;
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
  try {
    const options = {
      upload_preset: 'native',
      unsigned: true,
    }

    await upload(cloudinary, {
      file: file.uri, options: options, callback: async (error: any, response: any) => {
        console.log('Uploaded : ', response)
        await updateProfile(user, {
          photoURL: response.secure_url,
        })

        await updateDoc(doc(db, "users", user.uid), {
          photoUrl: response.secure_url,
        });
      }
    })

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