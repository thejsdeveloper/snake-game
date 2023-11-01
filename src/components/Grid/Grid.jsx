import GridCell from "../GridCell/GridCell";
import styles from "./Grid.module.css";

function Grid({ grid, status, score }) {
  return (
    <div
      className={styles.grid}
      style={{ "--rows": grid.length, "--cols": grid[0].length }}
    >
      {status === "end" && (
        <div className={styles.grid__status}>
          <p>Game over!</p>
          <p>Score: {score}</p>
          <p>Press space to restart</p>
        </div>
      )}

      {status === "idle" && (
        <div className={styles.grid__status}>
          <p>Press space to start</p>
        </div>
      )}
      {grid.map((rows, i) =>
        rows.map((col, j) => <GridCell key={`col-${i}-${j}`} content={col} />)
      )}
    </div>
  );
}

export default Grid;
