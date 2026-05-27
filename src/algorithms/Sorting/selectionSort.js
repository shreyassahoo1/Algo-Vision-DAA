// Helper to clone array
const clone = (arr) => [...arr];

// Generates an array of snapshots for Bubble Sort
export const selectionSort = (initialArray) => {
  const snapshots = [];
  const arr = clone(initialArray);
  const n = arr.length;
  let comparisons = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      snapshots.push({ array: clone(arr), activeIndices: [minIdx, j], isSwap: false, comparisons });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      snapshots.push({ array: clone(arr), activeIndices: [i, minIdx], isSwap: true, comparisons });
    }
  }
  snapshots.push({ array: clone(arr), activeIndices: [], isSwap: false, isComplete: true, comparisons });
  return snapshots;
};
