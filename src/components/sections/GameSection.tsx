import { Container } from "../layout/Container";
import { MinesweeperGame } from "../../games/minesweeper/Game";

export function GameSection() {
  return (
    <Container>
      <h2>Mini Game</h2>
      <p style={{ opacity: 0.85, marginTop: 0 }}>Minesweeper 💣</p>
      <MinesweeperGame />
    </Container>
  );
}
