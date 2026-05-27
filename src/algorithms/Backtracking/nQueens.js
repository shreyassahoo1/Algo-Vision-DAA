// Algorithms for Backtracking

export const nQueens = (n) => {
  const snapshots = [];
  const board = Array(n).fill(0).map(() => Array(n).fill(0));
  
  snapshots.push({
    board: board.map(row => [...row]),
    description: `Started N-Queens with N=${n}. Looking for a valid placement.`,
    activeCell: null,
    isBacktracking: false,
    solutionsFound: 0
  });

  let solutionsFound = 0;

  const isSafe = (board, row, col) => {
    // Check this column on upper rows
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }
    
    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    
    // Check upper diagonal on right side
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }

    return true;
  };

  const solveNQUtil = (board, row) => {
    // base case: If all queens are placed
    if (row >= n) {
      solutionsFound++;
      snapshots.push({
        board: board.map(row => [...row]),
        description: `Solution ${solutionsFound} found!`,
        activeCell: null,
        isBacktracking: false,
        solutionsFound
      });
      return true; // Return false if we want all solutions, true if we just want one. 
      // Let's find just the first solution for visualization clarity, or return false to find all.
      // We'll return true to stop at first solution to keep the visualization short.
    }

    for (let col = 0; col < n; col++) {
      snapshots.push({
        board: board.map(r => [...r]),
        description: `Checking cell (${row}, ${col}) for placing a queen.`,
        activeCell: { r: row, c: col },
        isBacktracking: false,
        solutionsFound
      });

      if (isSafe(board, row, col)) {
        // Place this queen
        board[row][col] = 1;
        snapshots.push({
          board: board.map(r => [...r]),
          description: `Placed queen at (${row}, ${col}). It is safe. Moving to next row.`,
          activeCell: { r: row, c: col },
          isBacktracking: false,
          solutionsFound
        });

        if (solveNQUtil(board, row + 1)) {
          return true;
        }

        // If placing queen in board[row][col] doesn't lead to a solution, then backtrack
        board[row][col] = 0; // BACKTRACK
        snapshots.push({
          board: board.map(r => [...r]),
          description: `Backtracking! Removing queen from (${row}, ${col}) because it led to no solution.`,
          activeCell: { r: row, c: col },
          isBacktracking: true,
          solutionsFound
        });
      } else {
        snapshots.push({
          board: board.map(r => [...r]),
          description: `Cell (${row}, ${col}) is under attack. Cannot place here.`,
          activeCell: { r: row, c: col },
          isBacktracking: false,
          solutionsFound
        });
      }
    }

    return false;
  };

  solveNQUtil(board, 0);

  snapshots.push({
    board: board.map(r => [...r]),
    description: `Algorithm complete. Found ${solutionsFound} solution(s).`,
    activeCell: null,
    isBacktracking: false,
    isComplete: true,
    solutionsFound
  });

  return snapshots;
};
