import type { Booking, CreateBooking } from "@/types/booking";
import type { Property } from "@/types/property";
import { database } from "@/config/firebaseConfig";
import { calculateNights } from "@/utils/helpers";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const mapDocumentToBooking = (document: {
  id: string;
  data: () => Record<string, unknown> | undefined;
}): Booking => {
  const data = document.data();

  return {
    id: document.id,
    userId: (data?.userId as string) ?? "",
    propertyId: (data?.propertyId as string) ?? "",
    propertyTitle: (data?.propertyTitle as string) ?? "",
    propertyImage: (data?.propertyImage as string) ?? "",
    checkIn: (data?.checkIn as Timestamp) ?? Timestamp.now(),
    checkOut: (data?.checkOut as Timestamp) ?? Timestamp.now(),
    guests: Number(data?.guests ?? 0),
    nights: Number(data?.nights ?? 0),
    pricePerNight: Number(data?.pricePerNight ?? 0),
    totalPrice: Number(data?.totalPrice ?? 0),
    createdAt: (data?.createdAt as Timestamp) ?? Timestamp.now(),
  };
};

export const createBooking = async (
  uid: string,
  bookingData: CreateBooking,
  property: Property,
): Promise<string> => {
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const pricePerNight = property.price;
  const totalPrice = nights * pricePerNight;

  const bookingRef = await addDoc(collection(database, "bookings"), {
    userId: uid,
    propertyId: bookingData.propertyId,
    propertyTitle: property.title,
    propertyImage: property.image,
    checkIn: Timestamp.fromDate(bookingData.checkIn),
    checkOut: Timestamp.fromDate(bookingData.checkOut),
    guests: bookingData.guests,
    nights,
    pricePerNight,
    totalPrice,
    createdAt: serverTimestamp(),
  });

  return bookingRef.id;
};

export const fetchUserBookings = async (uid: string): Promise<Booking[]> => {
  const bookingsQuery = query(
    collection(database, "bookings"),
    where("userId", "==", uid),
  );

  const querySnapshot = await getDocs(bookingsQuery);
  const bookings = querySnapshot.docs.map(mapDocumentToBooking);

  return bookings.sort((a, b) => {
    const dateA = a.checkIn.toMillis();
    const dateB = b.checkIn.toMillis();
    return dateB - dateA;
  });
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  const bookingRef = doc(database, "bookings", bookingId);
  await deleteDoc(bookingRef);
};

export const fetchPropertyBookedDates = async (
  propertyId: string,
): Promise<{ from: Date; to: Date }[]> => {
  const bookingsQuery = query(
    collection(database, "bookings"),
    where("propertyId", "==", propertyId),
  );

  const querySnapshot = await getDocs(bookingsQuery);
  const bookings = querySnapshot.docs.map(mapDocumentToBooking);

  return bookings.map((booking) => ({
    from: booking.checkIn.toDate(),
    to: booking.checkOut.toDate(),
  }));
};

export const checkPropertyAvailability = async (
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> => {
  const bookingsQuery = query(
    collection(database, "bookings"),
    where("propertyId", "==", propertyId),
  );

  const querySnapshot = await getDocs(bookingsQuery);
  const bookings = querySnapshot.docs.map(mapDocumentToBooking);

  for (const booking of bookings) {
    const bookingCheckIn = booking.checkIn.toDate();
    const bookingCheckOut = booking.checkOut.toDate();

    if (
      (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
      (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
      (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
    ) {
      return false;
    }
  }

  return true;
};

/** Abstraction layer for easier testing and backend swapping. */
export const bookingsApi = {
  create: (
    uid: string,
    bookingData: CreateBooking,
    property: Property,
  ) => createBooking(uid, bookingData, property),
  fetchUserBookings: (uid: string) => fetchUserBookings(uid),
  cancel: (bookingId: string) => cancelBooking(bookingId),
  fetchPropertyBookedDates: (propertyId: string) =>
    fetchPropertyBookedDates(propertyId),
  checkPropertyAvailability: (
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
  ) => checkPropertyAvailability(propertyId, checkIn, checkOut),
};
