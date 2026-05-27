export const fractionalKnapsack = (items, initialCapacity) => {
  const snapshots = [];
  let capacity = initialCapacity;
  let totalValue = 0;
  
  // Clone items to avoid mutating original
  const sortedItems = items.map(item => ({
    ...item,
    ratio: item.value / item.weight,
    taken: 0 // fraction taken
  }));

  snapshots.push({
    type: 'INIT',
    items: JSON.parse(JSON.stringify(sortedItems)),
    capacity,
    totalValue,
    description: 'Initial items. To maximize value, we should calculate the value-to-weight ratio for each item.',
    activeItemIdx: null,
    highlightItemIdx: null
  });

  sortedItems.sort((a, b) => b.ratio - a.ratio);

  snapshots.push({
    type: 'SORTED',
    items: JSON.parse(JSON.stringify(sortedItems)),
    capacity,
    totalValue,
    description: 'Items sorted by value-to-weight ratio in descending order.',
    activeItemIdx: null,
    highlightItemIdx: null
  });

  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    
    snapshots.push({
      type: 'CONSIDER',
      items: JSON.parse(JSON.stringify(sortedItems)),
      capacity,
      totalValue,
      description: `Considering Item ${item.id} (Weight: ${item.weight}, Value: ${item.value}, Ratio: ${item.ratio.toFixed(2)}). Current capacity is ${capacity}.`,
      activeItemIdx: i,
      highlightItemIdx: null
    });

    if (capacity === 0) {
      snapshots.push({
        type: 'FULL',
        items: JSON.parse(JSON.stringify(sortedItems)),
        capacity,
        totalValue,
        description: `Knapsack is full. We cannot take any more items.`,
        activeItemIdx: i,
        highlightItemIdx: null
      });
      break;
    }

    if (item.weight <= capacity) {
      capacity -= item.weight;
      totalValue += item.value;
      item.taken = 1;

      snapshots.push({
        type: 'TAKE_ALL',
        items: JSON.parse(JSON.stringify(sortedItems)),
        capacity,
        totalValue,
        description: `Item ${item.id} fully fits. Taking 100% of it. Value added: ${item.value}. Remaining capacity: ${capacity}.`,
        activeItemIdx: i,
        highlightItemIdx: i
      });
    } else {
      const fraction = capacity / item.weight;
      const valueAdded = item.value * fraction;
      totalValue += valueAdded;
      item.taken = fraction;
      capacity = 0;

      snapshots.push({
        type: 'TAKE_FRACTION',
        items: JSON.parse(JSON.stringify(sortedItems)),
        capacity,
        totalValue,
        description: `Item ${item.id} only partially fits. Taking ${(fraction * 100).toFixed(0)}% of it. Value added: ${valueAdded.toFixed(2)}. Knapsack is now full.`,
        activeItemIdx: i,
        highlightItemIdx: i
      });
    }
  }

  snapshots.push({
    type: 'DONE',
    items: JSON.parse(JSON.stringify(sortedItems)),
    capacity,
    totalValue,
    description: `Algorithm complete. Total maximum value obtained: ${totalValue.toFixed(2)}.`,
    activeItemIdx: null,
    highlightItemIdx: null
  });

  return snapshots;
};
