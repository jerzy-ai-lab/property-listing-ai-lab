/**
 * Central API layer exports.
 * Use *Api objects for easier mocking in tests.
 */

export { propertiesApi, fetchProperties, fetchPropertyById } from "./properties";
export { authApi, getAuthErrorMessage } from "./auth";
export { bookingsApi } from "./bookings";
export { usersApi } from "./users";
export { imagesApi } from "./images";
export type { UploadImageResult } from "./images";
export { ApiError, ok, err } from "./types";
export type { Result } from "./types";
