// Helper to clone array
const clone = (arr) => [...arr];

// Generates an array of snapshots for Bubble Sort
export const bubbleSort = (initialArray) => {
  const snapshots = [];
  const arr = clone(initialArray);
  const n = arr.length;
  let comparisons = 0;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      snapshots.push({
        array: clone(arr),
        activeIndices: [j, j + 1],
        isSwap: false,
        comparisons
      });
      
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        
        snapshots.push({
          array: clone(arr),
          activeIndices: [j, j + 1],
          isSwap: true,
          comparisons
        });
      }
    }
  }
  
  snapshots.push({
    array: clone(arr),
    activeIndices: [],
    isSwap: false,
    isComplete: true,
    comparisons
  });
  
  return snapshots;
};
