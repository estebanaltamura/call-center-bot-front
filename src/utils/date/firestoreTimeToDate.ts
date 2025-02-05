function convertFirestoreTimestamp(timestamp: { seconds: number; nanoseconds: number }): Date {
  return new Date(timestamp.seconds * 1000);
}

export const firestoreTimeToDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
  const date = convertFirestoreTimestamp(timestamp);
  return date.toLocaleString();
};
