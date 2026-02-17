import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type UserCredential,
  type User,
} from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

export const getAuthErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead of creating a new account.";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password should be at least 8 characters";
    case "auth/invalid-credential":
      return "Invalid email or password. Used Google before? Continue with Google instead.";
    case "auth/wrong-password":
      return "Wrong password";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later";
    case "auth/popup-closed-by-user":
      return "Sign in cancelled";
    case "auth/popup-blocked":
      return "Popup blocked. Please allow popups for this site";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    case "auth/internal-error":
      return "An internal error occurred. Please try again";
    case "auth/unauthorized-domain":
      return "This domain is not authorized. Add it in Firebase Console → Authentication → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.";
    case "auth/cancelled-popup-request":
      return "Sign in cancelled. Please try again.";
    default:
      return "An error occurred. Please try again";
  }
};

export const signUp = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

export const signIn = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const updateUser = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  await currentUser.reload();
  await currentUser.getIdToken(true);
  return currentUser;
};

export const emailVerification = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No user is currently signed in");
  await sendEmailVerification(currentUser);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  return signInWithPopup(auth, provider);
};

export const isGoogleUser = (user: User): boolean => {
  return user.providerData.some(
    (provider) => provider.providerId === "google.com",
  );
};

export const reauthenticateUser = async (password?: string): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No user is currently signed in");

  if (isGoogleUser(currentUser)) {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    await reauthenticateWithPopup(currentUser, provider);
  } else {
    if (!password) throw new Error("Password is required for email/password users");
    if (!currentUser.email) throw new Error("User email is not available");
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password,
    );
    await reauthenticateWithCredential(currentUser, credential);
  }

  await currentUser.reload();
  await currentUser.getIdToken(true);
};

export const deleteUserAccount = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No user is currently signed in");
  await currentUser.delete();
};

/** Abstraction layer for easier testing and backend swapping. */
export const authApi = {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updateUser,
  emailVerification,
  signInWithGoogle,
  reauthenticateUser,
  deleteUserAccount,
  getAuthErrorMessage,
  isGoogleUser,
};
