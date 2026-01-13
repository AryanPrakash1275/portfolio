export interface Preset {
  rows: number;
  cols: number;
  mines: number;
}

export const PRESETS: Record<"easy" | "medium", Preset> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
};
