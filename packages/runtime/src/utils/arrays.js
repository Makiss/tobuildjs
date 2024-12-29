export function withoutNulls(arr) {
  // filter null and undefined values
  return arr.filter((item) => item != null);
}
