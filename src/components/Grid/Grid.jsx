/* eslint-disable react/prop-types */
import styles from "./Grid.module.css";
const GridCell = ({ content }) => {
  let style = {};
  if (content === "snake") {
    style = {
      backgroundColor: "#f19fb6",
    };
  }

  if (content === "snake-head") {
    style = {
      backgroundColor: "#f27195",
    };
  }
  if (content === "fruit") {
    style = {
      backgroundColor: "var(--primary)",
    };
  }
  return <div className={styles.grid__col} style={style}></div>;
};

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
