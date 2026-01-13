export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
}

export type Board = Cell[][];

export type GameStatus = "ready" | "playing" | "won" | "lost";

export interface GameState {
  board: Board;
  rows: number;
  cols: number;
  mines: number;
  revealedCount: number;
  flaggedCount: number;
  status: GameStatus;
}
