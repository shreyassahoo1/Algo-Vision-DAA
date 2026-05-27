// Helper to clone array
const clone = (arr) => [...arr];

// Generates an array of snapshots for Bubble Sort
export const mergeSort = (initialArray) => {
  const snapshots = [];
  const arr = clone(initialArray);
  let comparisons = 0;

  const merge = (start, mid, end) => {
    let start2 = mid + 1;
    if (arr[mid] <= arr[start2]) return;

    while (start <= mid && start2 <= end) {
      comparisons++;
      snapshots.push({ array: clone(arr), activeIndices: [start, start2], isSwap: false, comparisons });
      if (arr[start] <= arr[start2]) {
        start++;
      } else {
        let value = arr[start2];
        let index = start2;
        while (index !== start) {
          arr[index] = arr[index - 1];
          index--;
        }
        arr[start] = value;
        snapshots.push({ array: clone(arr), activeIndices: [start, start2], isSwap: true, comparisons });
        start++;
        mid++;
        start2++;
      }
    }
  };

  const mergeSortHelper = (l, r) => {
    if (l < r) {
      let m = l + Math.floor((r - l) / 2);
      mergeSortHelper(l, m);
      mergeSortHelper(m + 1, r);
      merge(l, m, r);
    }
  };

  mergeSortHelper(0, arr.length - 1);
  snapshots.push({ array: clone(arr), activeIndices: [], isSwap: false, isComplete: true, comparisons });
  return snapshots;
};
