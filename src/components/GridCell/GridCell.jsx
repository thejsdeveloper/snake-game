import styles from "./GridCell.module.css";

const GridCell = ({ content }) => {
  /**
   * There are css variable in index.css for
   * matching content refer index.css
   * --snake-head: #f27195;
   * --snake: #f19fb6;
   * --fruit: #006d77;
   * --empty: #fff;
   */
  let style = {
    backgroundColor: `var(--${content})`,
  };
  return <div className={styles.grid__col} style={style}></div>;
};

export default GridCell;
