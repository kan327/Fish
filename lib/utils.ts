export function handleError(e: unknown) {
  if (e instanceof Error) {
    return { error: e.message };
  }
  return { error: "Internal Server Error (unknown error)" };
}