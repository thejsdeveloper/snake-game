/* eslint-disable no-extra-boolean-cast */
import styles from "./App.module.css";
import Grid from "./components/Grid/Grid";
import { SNAKE_HIGHEST_SCORE_KEY } from "./constants/gameConstants";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSnakeGame } from "./reducers/gameReducer";

function App() {
  const { state } = useSnakeGame();

  const { grid, status, score } = state;

  const [highestScore, setHighestScore] = useLocalStorage(
    SNAKE_HIGHEST_SCORE_KEY,
    0
  );

  if (score > highestScore) {
    setHighestScore(score);
  }

  return (
    <div className={styles.gameContainer}>
      <p className={styles.title}>Snake Game</p>
      <section className={styles.score}>
        <p>Score: {score}</p>
        <p>Highest Score: {highestScore}</p>
      </section>
      <Grid grid={grid} status={status} score={score} />
    </div>
  );
}

export default App;
