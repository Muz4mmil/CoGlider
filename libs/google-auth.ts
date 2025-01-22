import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/configs/firebase-config';

export const signInWithGoogle = async () => {
  try {
    const respose = await GoogleSignin.signIn();
    const idToken = respose.data?.idToken;

    const googleCredential = GoogleAuthProvider.credential(idToken);

    const authUser = await signInWithCredential(auth, googleCredential);
    return authUser.user
  } catch (error) {
    console.error('Error signing in with Google: ', error);
  }
};

export const googleLogout = () => {
  try {
    GoogleSignin.revokeAccess()
    GoogleSignin.signOut()
  } catch (error) {
    console.error('Error signing out with Google: ', error);
  }
}