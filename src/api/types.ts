/** Consistent API error format for easier handling and testing. */
export class ApiError extends Error {
  readonly code?: string;
  readonly cause?: unknown;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Result type – alternative to throwing. Enables explicit error handling and testing. */
export type Result<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/** Creates a successful Result. */
export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

/** Creates a failed Result. */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
