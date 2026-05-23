export type DbResult<T> = {
  data: T;
  error: string | null;
  configured: boolean;
};

export function dbUnavailable<T>(fallback: T): DbResult<T> {
  return { data: fallback, error: null, configured: false };
}

export function dbSuccess<T>(data: T): DbResult<T> {
  return { data, error: null, configured: true };
}

export function dbError<T>(fallback: T, message: string): DbResult<T> {
  return { data: fallback, error: message, configured: true };
}
