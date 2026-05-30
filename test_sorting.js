import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from './src/algorithms/sorting/index.js';

const generateArray = () => Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));

const isSorted = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i+1]) return false;
  }
  return true;
};

const testAlgo = (name, algoFn) => {
  const initial = generateArray();
  const snapshots = algoFn(initial);
  const finalSnapshot = snapshots[snapshots.length - 1];
  const sorted = isSorted(finalSnapshot.array);
  
  console.log(`${name}: ${sorted ? '✅ PASS' : '❌ FAIL'} | Comparisons: ${finalSnapshot.comparisons}`);
  if (!sorted) {
    console.log('Initial:', initial);
    console.log('Final:', finalSnapshot.array);
  }
};

testAlgo('Bubble Sort', bubbleSort);
testAlgo('Selection Sort', selectionSort);
testAlgo('Insertion Sort', insertionSort);
testAlgo('Merge Sort', mergeSort);
testAlgo('Quick Sort', quickSort);
