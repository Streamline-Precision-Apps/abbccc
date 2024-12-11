export const arraysAreEqual = <T>(
  arr1: T[],
  arr2: T[],
  comparator?: (a: T, b: T) => boolean
): boolean => {
  if (arr1.length !== arr2.length) return false;

  if (comparator) {
    // Compare using the provided comparator function
    return arr1.every((item1) =>
      arr2.some((item2) => comparator(item1, item2))
    );
  } else {
    // Default comparison (shallow equality for primitives and references)
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    return Array.from(set1).every((item) => set2.has(item));
  }
};
