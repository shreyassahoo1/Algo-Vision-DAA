export const knapsackDP = (items, capacity) => {
  const snapshots = [];
  const n = items.length;
  // dp[i][w]
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  snapshots.push({
    type: 'INIT',
    dp: dp.map(row => [...row]),
    description: 'Initialize DP table with 0s.',
    activeCell: null,
    highlightCells: []
  });

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 1; w <= capacity; w++) {
      let newValue;
      let description = '';
      let highlightCells = [{ r: i - 1, c: w }]; // always look at the cell directly above

      if (item.weight <= w) {
        const valueWithoutItem = dp[i - 1][w];
        const valueWithItem = item.value + dp[i - 1][w - item.weight];
        newValue = Math.max(valueWithoutItem, valueWithItem);
        highlightCells.push({ r: i - 1, c: w - item.weight });
        
        if (valueWithItem > valueWithoutItem) {
          description = `Item ${i} fits (weight ${item.weight} <= ${w}). Taking it gives ${item.value} + ${dp[i-1][w-item.weight]} = ${valueWithItem}, which is > ${valueWithoutItem} (not taking).`;
        } else {
          description = `Item ${i} fits, but taking it (${valueWithItem}) is not better than not taking it (${valueWithoutItem}).`;
        }
      } else {
        newValue = dp[i - 1][w];
        description = `Item ${i} weight (${item.weight}) > current capacity ${w}. Cannot take it. Copy value from above.`;
      }

      dp[i][w] = newValue;
      
      snapshots.push({
        type: 'COMPUTE',
        dp: dp.map(row => [...row]),
        description,
        activeCell: { r: i, c: w },
        highlightCells
      });
    }
  }
  
  // Backtrack to find items
  let res = dp[n][capacity];
  let w = capacity;
  const selectedItems = [];
  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      res -= items[i - 1].value;
      w -= items[i - 1].weight;
    }
  }

  snapshots.push({
    type: 'DONE',
    dp: dp.map(row => [...row]),
    description: `Done filling table. Max value is ${dp[n][capacity]}. Selected items: ${selectedItems.reverse().map(i => i + 1).join(', ') || 'None'}`,
    activeCell: null,
    highlightCells: []
  });

  return snapshots;
};
