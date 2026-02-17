import {
  type Property,
  type CreatePropertyData,
  type FirestorePropertyDocument,
  isFirestorePropertyDocument,
} from "@/types/property";
import { database } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const mapDocumentToProperty = (document: {
  id: string;
  data: () => Record<string, unknown> | undefined;
}): Property => {
  const raw = document.data();
  const data: FirestorePropertyDocument = isFirestorePropertyDocument(raw)
    ? raw
    : {};

  const coordinates = data.coordinates as
    | { lat: number; lng: number }
    | undefined;
  const images = data.images as string[] | undefined;

  return {
    id: document.id,
    hostId: data.hostId ?? "",
    title: data.title ?? "",
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    description: data.description ?? "",
    price: Number(data.price ?? 0),
    rating: Number(data.rating ?? 0),
    superhost: Boolean(data.superhost),
    address: {
      street: data.address?.street ?? "",
      zipCode: data.address?.zipCode ?? "",
      city: data.address?.city ?? "",
      country: data.address?.country ?? "",
    },
    image: data.image ?? "",
    images: Array.isArray(images) ? images : [],
    coordinates:
      coordinates &&
      typeof coordinates.lat === "number" &&
      typeof coordinates.lng === "number"
        ? { lat: coordinates.lat, lng: coordinates.lng }
        : undefined,
    capacity: {
      guest: Number(data.capacity?.guest ?? 0),
      bedroom: Number(data.capacity?.bedroom ?? 0),
    },
    host: {
      name: data.host?.name ?? "",
      image: data.host?.image ?? "",
    },
  };
};

export const fetchProperties = async (
  signal?: AbortSignal,
): Promise<Property[]> => {
  const querySnapshot = await getDocs(collection(database, "properties"));

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  return querySnapshot.docs.map(mapDocumentToProperty);
};

export const fetchPropertyById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Property | null> => {
  const docSnapshot = await getDoc(doc(database, "properties", id));

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  if (!docSnapshot.exists()) {
    return null;
  }

  return mapDocumentToProperty(docSnapshot);
};

export const createProperty = async (
  uid: string,
  data: CreatePropertyData,
): Promise<string> => {
  const docRef = await addDoc(collection(database, "properties"), {
    hostId: uid,
    title: data.title,
    description: data.description,
    price: data.price,
    rating: data.rating,
    superhost: data.superhost,
    image: data.image,
    address: data.address,
    amenities: data.amenities,
    capacity: data.capacity,
    host: data.host,
    ...(data.coordinates && { coordinates: data.coordinates }),
  });
  return docRef.id;
};

export const updateUserPropertiesHostInfo = async (
  hostId: string,
  hostName: string,
  hostImage: string,
): Promise<void> => {
  const propertiesQuery = query(
    collection(database, "properties"),
    where("hostId", "==", hostId),
  );
  const querySnapshot = await getDocs(propertiesQuery);

  const updatePromises = querySnapshot.docs.map((propertyDoc) =>
    updateDoc(propertyDoc.ref, {
      host: {
        name: hostName.trim().toLowerCase(),
        image: hostImage,
      },
    }),
  );

  await Promise.all(updatePromises);
};

/** Abstraction layer for easier testing and backend swapping. */
export const propertiesApi = {
  getAll: (signal?: AbortSignal) => fetchProperties(signal),
  getById: (id: string, signal?: AbortSignal) => fetchPropertyById(id, signal),
  create: (uid: string, data: CreatePropertyData) => createProperty(uid, data),
  updateUserPropertiesHostInfo: (
    hostId: string,
    hostName: string,
    hostImage: string,
  ) => updateUserPropertiesHostInfo(hostId, hostName, hostImage),
};
