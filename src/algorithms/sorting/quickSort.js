// Helper to clone array
const clone = (arr) => [...arr];

// Generates an array of snapshots for Bubble Sort
export const quickSort = (initialArray) => {
  const snapshots = [];
  const arr = clone(initialArray);
  let comparisons = 0;

  const partition = (low, high) => {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      comparisons++;
      snapshots.push({ array: clone(arr), activeIndices: [j, high], isSwap: false, comparisons });
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        snapshots.push({ array: clone(arr), activeIndices: [i, j], isSwap: true, comparisons });
      }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    snapshots.push({ array: clone(arr), activeIndices: [i + 1, high], isSwap: true, comparisons });
    return i + 1;
  };

  const quickSortHelper = (low, high) => {
    if (low < high) {
      let pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  };

  quickSortHelper(0, arr.length - 1);
  snapshots.push({ array: clone(arr), activeIndices: [], isSwap: false, isComplete: true, comparisons });
  return snapshots;
};
