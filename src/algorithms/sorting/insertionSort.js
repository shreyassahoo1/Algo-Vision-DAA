// Helper to clone array
const clone = (arr) => [...arr];

// Generates an array of snapshots for Bubble Sort
export const insertionSort = (initialArray) => {
  const snapshots = [];
  const arr = clone(initialArray);
  let comparisons = 0;

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      comparisons++;
      snapshots.push({ array: clone(arr), activeIndices: [j, j + 1], isSwap: false, comparisons });
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        snapshots.push({ array: clone(arr), activeIndices: [j, j + 1], isSwap: true, comparisons });
        j = j - 1;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    snapshots.push({ array: clone(arr), activeIndices: [j + 1], isSwap: false, comparisons });
  }
  snapshots.push({ array: clone(arr), activeIndices: [], isSwap: false, isComplete: true, comparisons });
  return snapshots;
};
