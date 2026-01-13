import { useEffect, useMemo, useReducer, useRef } from "react";
import { PRESETS } from "./presets";
import type { GameState } from "./types";
import { createInitialState, plantMines, revealCell, toggleFlag } from "./engine";
import { playSfx, setSfxEnabled, unlockSfx } from "./sfx";
import "./minesweeper.css";

type Difficulty = keyof typeof PRESETS;

type Action =
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "RESET" }
  | { type: "REVEAL"; row: number; col: number }
  | { type: "TOGGLE_FLAG"; row: number; col: number }
  | { type: "TOGGLE_SFX" }
  | { type: "TICK"; now: number };

type UIState = {
  difficulty: Difficulty;
  game: GameState;
  startedAt: number | null;
  elapsedMs: number;
  sfxEnabled: boolean;
};

function newUIState(difficulty: Difficulty, sfxEnabled: boolean): UIState {
  const p = PRESETS[difficulty];
  return {
    difficulty,
    game: createInitialState(p.rows, p.cols, p.mines),
    startedAt: null,
    elapsedMs: 0,
    sfxEnabled,
  };
}

function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case "SET_DIFFICULTY": {
      return newUIState(action.difficulty, state.sfxEnabled);
    }
    case "RESET": {
      return newUIState(state.difficulty, state.sfxEnabled);
    }
    case "TOGGLE_SFX": {
      return { ...state, sfxEnabled: !state.sfxEnabled };
    }
    case "TICK": {
      if (!state.startedAt) return state;
      if (state.game.status !== "playing") return state;
      const elapsedMs = Math.max(0, action.now - state.startedAt);
      return { ...state, elapsedMs };
    }
    case "TOGGLE_FLAG": {
      if (state.game.status === "ready") return state;
      const game = toggleFlag(state.game, { row: action.row, col: action.col });
      return { ...state, game };
    }
    case "REVEAL": {
      const { row, col } = action;

      // First reveal: plant mines with first-click safety, start timer
      if (state.game.status === "ready") {
        const planted = plantMines(state.game, { row, col }, { safeRadius: 0 });
        const revealed = revealCell(planted, { row, col });
        return {
          ...state,
          game: revealed,
          startedAt: Date.now(),
          elapsedMs: 0,
        };
      }

      if (state.game.status !== "playing") return state;

      const game = revealCell(state.game, { row, col });
      return { ...state, game };
    }
    default:
      return state;
  }
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function MinesweeperGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => newUIState("easy", true));

  const tickRef = useRef<number | null>(null);

  // play win/boom once per transition
  const prevStatusRef = useRef<GameState["status"]>("ready");

  useEffect(() => {
    const loop = () => {
      dispatch({ type: "TICK", now: Date.now() });
      tickRef.current = window.setTimeout(loop, 250);
    };
    loop();
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    };
  }, []);

  const { game, difficulty, sfxEnabled } = state;

  useEffect(() => {
    setSfxEnabled(sfxEnabled);
  }, [sfxEnabled]);

  useEffect(() => {
    const prev = prevStatusRef.current;
    const next = game.status;

    if (prev !== next) {
      if (next === "won") playSfx("win");
      if (next === "lost") playSfx("boom");
      prevStatusRef.current = next;
    }
  }, [game.status]);

  const minesLeft = useMemo(
    () => Math.max(0, game.mines - game.flaggedCount),
    [game.mines, game.flaggedCount]
  );

  const statusText = useMemo(() => {
    if (game.status === "ready") return "Click a cell to start (first click is safe).";
    if (game.status === "playing") return "Left click: reveal • Right click: flag";
    if (game.status === "won") return "You won. Clean.";
    return "Boom. You lost.";
  }, [game.status]);

  const onCellLeftClick = (row: number, col: number) => {
    void unlockSfx();
    if (game.status === "playing" || game.status === "ready") playSfx("click");
    dispatch({ type: "REVEAL", row, col });
  };

  const onCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    void unlockSfx();
    if (game.status !== "ready") playSfx("flag");
    dispatch({ type: "TOGGLE_FLAG", row, col });
  };

  // Mobile long-press to flag
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const onTouchStart = (row: number, col: number) => {
    longPressTriggered.current = false;
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);

    longPressTimer.current = window.setTimeout(() => {
      void unlockSfx();
      longPressTriggered.current = true;
      if (game.status !== "ready") playSfx("flag");
      dispatch({ type: "TOGGLE_FLAG", row, col });
    }, 380);
  };

  const onTouchEnd = (row: number, col: number) => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);

    if (!longPressTriggered.current) {
      void unlockSfx();
      if (game.status === "playing" || game.status === "ready") playSfx("click");
      dispatch({ type: "REVEAL", row, col });
    }
  };

  return (
    <div className="ms">
      <div className="ms__top">
        <div className="ms__meta">
          <div className="ms__pill">
            <span className="ms__label">Mines</span>
            <span className="ms__value">{minesLeft}</span>
          </div>
          <div className="ms__pill">
            <span className="ms__label">Time</span>
            <span className="ms__value">{formatTime(state.elapsedMs)}</span>
          </div>
          <div className="ms__pill">
            <span className="ms__label">Mode</span>
            <span className="ms__value">{difficulty}</span>
          </div>
        </div>

        <div className="ms__actions">
          <select
            className="ms__select"
            value={difficulty}
            onChange={(e) =>
              dispatch({ type: "SET_DIFFICULTY", difficulty: e.target.value as Difficulty })
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
          </select>

          <button className="ms__btn" onClick={() => dispatch({ type: "RESET" })}>
            Reset
          </button>

          <button
            className="ms__btn"
            type="button"
            aria-pressed={sfxEnabled}
            onClick={() => dispatch({ type: "TOGGLE_SFX" })}
            title="Toggle sound effects"
          >
            SFX {sfxEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="ms__hint">{statusText}</div>

      <div
        className="ms__board"
        style={{
          gridTemplateColumns: `repeat(${game.cols}, var(--cell))`,
        }}
      >
        {game.board.map((row, r) =>
          row.map((cell, c) => {
            const revealed = cell.state === "revealed";
            const flagged = cell.state === "flagged";
            const mine = revealed && cell.isMine;

            // Let CSS render flag/TNT; only show numbers
            let text = "";
            if (revealed && !mine && cell.adjacentMines > 0) text = String(cell.adjacentMines);

            return (
              <button
                key={`${r}-${c}`}
                className={[
                  "ms__cell",
                  revealed ? "is-revealed" : "",
                  flagged ? "is-flagged" : "",
                  mine ? "is-mine" : "",
                ].join(" ")}
                onClick={() => onCellLeftClick(r, c)}
                onContextMenu={(e) => onCellRightClick(e, r, c)}
                onTouchStart={() => onTouchStart(r, c)}
                onTouchEnd={() => onTouchEnd(r, c)}
                aria-label={`Cell ${r + 1}, ${c + 1}`}
              >
                {text}
              </button>
            );
          })
        )}
      </div>

      <div className="ms__footer">
        <span className="ms__small">Tip: mobile flag = long press. Desktop flag = right click.</span>
      </div>
    </div>
  );
}
