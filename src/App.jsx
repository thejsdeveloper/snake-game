/* eslint-disable no-extra-boolean-cast */
import styles from "./App.module.css";
import Grid from "./components/Grid/Grid";
import { useSnakeGame } from "./reducers/gameReducer";

function App() {
  const { state } = useSnakeGame();
  const { grid, status, score } = state;
  return (
    <div className={styles.gameContainer}>
      <p className={styles.title}>Snake Game</p>
      <section className={styles.score}>
        <p>Score: {score}</p>
        <p>Highest Score: {score}</p>
      </section>
      <Grid grid={grid} status={status} score={score} />
    </div>
  );
}

export default App;
