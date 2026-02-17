import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { database } from "@/config/firebaseConfig";
import type {
  CreateUserProfile,
  UserProfile,
  UpdateUserProfile,
} from "@/types/user";
import { updateUserPropertiesHostInfo } from "@/api/properties";

export const createUserProfile = async (
  uid: string,
  profileData: CreateUserProfile,
): Promise<void> => {
  const userRef = doc(database, "users", uid);
  await setDoc(
    userRef,
    {
      email: profileData.email,
      accountCreatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const listenToUserProfile = (
  uid: string,
  onProfileChange: (profile: UserProfile | null) => void,
  onProfileError: (error: unknown) => void,
) => {
  const docRef = doc(database, "users", uid);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        onProfileChange(null);
        return;
      }
      const data = docSnap.data();
      onProfileChange({
        uid,
        email: data.email ?? null,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        phone: data.phone ?? null,
        profileImage: data.profileImage ?? null,
        accountCreatedAt: data.accountCreatedAt ?? null,
        updatedAt: data.updatedAt ?? null,
      });
    },
    onProfileError,
  );
};

export const updateUserProfile = async (
  uid: string,
  profileData: UpdateUserProfile,
): Promise<void> => {
  await setDoc(
    doc(database, "users", uid),
    {
      firstName: profileData.firstName ?? null,
      lastName: profileData.lastName ?? null,
      phone: profileData.phone ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  const userDoc = await getDoc(doc(database, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const firstName = (userData.firstName as string | null) ?? "";
    const profileImage = (userData.profileImage as string | null) ?? "";
    if (firstName || profileImage) {
      await updateUserPropertiesHostInfo(uid, firstName, profileImage);
    }
  }
};

export const updateUserProfileImage = async (
  uid: string,
  profileImageUrl: string,
): Promise<void> => {
  await setDoc(
    doc(database, "users", uid),
    {
      profileImage: profileImageUrl,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  const userDoc = await getDoc(doc(database, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const firstName = (userData.firstName as string | null) ?? "";
    if (firstName || profileImageUrl) {
      await updateUserPropertiesHostInfo(uid, firstName, profileImageUrl);
    }
  }
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
  const userRef = doc(database, "users", uid);
  await deleteDoc(userRef);
};

/** Abstraction layer for easier testing and backend swapping. */
export const usersApi = {
  createUserProfile: (
    uid: string,
    profileData: CreateUserProfile,
  ) => createUserProfile(uid, profileData),
  listenToUserProfile,
  updateUserProfile: (
    uid: string,
    profileData: UpdateUserProfile,
  ) => updateUserProfile(uid, profileData),
  updateUserProfileImage: (uid: string, profileImageUrl: string) =>
    updateUserProfileImage(uid, profileImageUrl),
  deleteUserProfile: (uid: string) => deleteUserProfile(uid),
};
