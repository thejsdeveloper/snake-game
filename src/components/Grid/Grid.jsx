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

function Grid({ grid, status }) {
  return (
    <div className={styles.grid}>
      {status === "end" && (
        <div className={styles.grid__status}>
          <p>Game over!</p>
          <p>Score: {0}</p>
          <p>Press space to restart</p>
        </div>
      )}

      {status === "idle" && (
        <div className={styles.grid__status}>
          <p>Press space to start</p>
        </div>
      )}
      {grid.map((rows, i) => {
        return (
          <div key={`row-${i}`} className={styles.grid__row}>
            {rows.map((col, j) => {
              return <GridCell key={`col-${i}-${j}`} content={col}></GridCell>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
