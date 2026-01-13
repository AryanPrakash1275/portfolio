import type { Board, Cell, GameState } from "./types";

export function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c): Cell => ({
      row: r,
      col: c,
      isMine: false,
      adjacentMines: 0,
      state: "hidden",
    }))
  );
}

export function createInitialState(rows: number, cols: number, mines: number): GameState {
  return {
    board: createEmptyBoard(rows, cols),
    rows,
    cols,
    mines,
    revealedCount: 0,
    flaggedCount: 0,
    status: "ready",
  };
}

function inBounds(rows: number, cols: number, r: number, c: number) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

export function getNeighbors(rows: number, cols: number, r: number, c: number) {
  const res: Array<[number, number]> = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(rows, cols, nr, nc)) res.push([nr, nc]);
    }
  }
  return res;
}

function computeAdjacentCounts(board: Board) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.isMine) {
        cell.adjacentMines = 0;
        continue;
      }
      const neighbors = getNeighbors(rows, cols, r, c);
      let count = 0;
      for (const [nr, nc] of neighbors) {
        if (board[nr][nc].isMine) count++;
      }
      cell.adjacentMines = count;
    }
  }
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Place mines randomly, guaranteeing:
 * - First click cell is NOT a mine
 * - First click neighbors are also NOT mines (safeRadius=1 default)
 */
export function plantMines(
  state: GameState,
  firstClick: { row: number; col: number },
  options?: { safeRadius?: 0 | 1 }
): GameState {
  const safeRadius = options?.safeRadius ?? 1;
  const { rows, cols, mines } = state;

  const nextBoard = cloneBoard(state.board);

  const forbidden = new Set<string>();
  forbidden.add(`${firstClick.row},${firstClick.col}`);

  if (safeRadius === 1) {
    for (const [nr, nc] of getNeighbors(rows, cols, firstClick.row, firstClick.col)) {
      forbidden.add(`${nr},${nc}`);
    }
  }

  const candidates: Array<[number, number]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!forbidden.has(`${r},${c}`)) candidates.push([r, c]);
    }
  }

  if (mines > candidates.length) {
    throw new Error("Too many mines for board size with current safe radius.");
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (let i = 0; i < mines; i++) {
    const [r, c] = candidates[i];
    nextBoard[r][c].isMine = true;
  }

  computeAdjacentCounts(nextBoard);

  return {
    ...state,
    board: nextBoard,
    status: "playing",
  };
}

function isWin(next: GameState) {
  const safeCells = next.rows * next.cols - next.mines;
  return next.revealedCount >= safeCells;
}

/**
 * Toggle flag on a cell.
 * - Works only if game is not finished
 * - Only hidden ↔ flagged toggles; revealed cells ignore
 */
export function toggleFlag(state: GameState, pos: { row: number; col: number }): GameState {
  if (state.status === "won" || state.status === "lost") return state;

  const { row, col } = pos;
  const cell = state.board[row]?.[col];
  if (!cell) return state;
  if (cell.state === "revealed") return state;

  const nextBoard = cloneBoard(state.board);
  const nextCell = nextBoard[row][col];

  let flaggedCount = state.flaggedCount;

  if (nextCell.state === "hidden") {
    nextCell.state = "flagged";
    flaggedCount++;
  } else if (nextCell.state === "flagged") {
    nextCell.state = "hidden";
    flaggedCount--;
  }

  return {
    ...state,
    board: nextBoard,
    flaggedCount,
  };
}

/**
 * Reveal a cell.
 * Rules:
 * - If state is "ready": this call should be made AFTER plantMines (UI will do that on first click)
 * - Clicking a mine => lose, reveal all mines
 * - Clicking a number => reveal just that cell
 * - Clicking a zero => reveal connected zero-region + its border numbers (flood fill)
 */
export function revealCell(state: GameState, pos: { row: number; col: number }): GameState {
  if (state.status === "won" || state.status === "lost") return state;

  const { row, col } = pos;
  const cell = state.board[row]?.[col];
  if (!cell) return state;
  if (cell.state === "revealed" || cell.state === "flagged") return state;

  const nextBoard = cloneBoard(state.board);
  let revealedCount = state.revealedCount;

  const target = nextBoard[row][col];

  // Mine hit => lose
  if (target.isMine) {
    // reveal all mines
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const cur = nextBoard[r][c];
        if (cur.isMine) cur.state = "revealed";
      }
    }
    return {
      ...state,
      board: nextBoard,
      status: "lost",
    };
  }

  // Flood fill with queue (BFS)
  const queue: Array<[number, number]> = [[row, col]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cur = nextBoard[cr][cc];

    if (cur.state === "revealed" || cur.state === "flagged") continue;
    if (cur.isMine) continue;

    cur.state = "revealed";
    revealedCount++;

    // Expand only from zeros; still reveal border numbers
    if (cur.adjacentMines === 0) {
      for (const [nr, nc] of getNeighbors(state.rows, state.cols, cr, cc)) {
        const n = nextBoard[nr][nc];
        if (n.state === "hidden" && !n.isMine) {
          queue.push([nr, nc]);
        }
      }
    }
  }

  const nextState: GameState = {
    ...state,
    board: nextBoard,
    revealedCount,
  };

  if (isWin(nextState)) {
    return {
      ...nextState,
      status: "won",
    };
  }

  return nextState;
}
