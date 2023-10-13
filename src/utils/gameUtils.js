import { COLUNMS, DIRECTION_DELTAS, ROWS } from "../constants/gameConstants";

export const getNextPostion = (currentPos, direction) => {
  const { x, y } = currentPos;
  const [dx, dy] = DIRECTION_DELTAS[direction];
  return {
    x: x + dx,
    y: y + dy,
  };
};

export const isMoveWithinBounds = (x, y) => {
  return x > -1 && x < COLUNMS && y > -1 && y < ROWS;
};

export const isCollidedWithItself = (nextPostion, snake) => {
  const { x: snakeHeadX, y: snakeHeadY } = nextPostion;
  return snake.some(({ x, y }) => x === snakeHeadX && y === snakeHeadY);
};

export const generateGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLUNMS).fill("empty"));

export const hasEatenFruit = (snakeHeadPosition, fruitPosition) => {
  const { x: snakeHeadX, y: snakeHeadY } = snakeHeadPosition;
  const { x: fruitX, y: fruitY } = fruitPosition;
  return snakeHeadX === fruitX && snakeHeadY === fruitY;
};

export const generateGridWithSnakeAndApple = (
  snakePositions,
  fruitPosition = null
) => {
  const grid = generateGrid();
  const { x: snakeHeadX, y: snakeHeadY } = snakePositions[0];
  for (let { x, y } of snakePositions) {
    grid[x][y] = x === snakeHeadX && y === snakeHeadY ? "snake-head" : "snake";
  }

  if (fruitPosition) {
    grid[fruitPosition.x][fruitPosition.y] = "fruit";
  }
  return grid;
};

const generateRandomPosition = () => {
  const row = Math.floor(Math.random() * ROWS);
  const col = Math.floor(Math.random() * COLUNMS);
  return { x: row, y: col };
};

export const generateRandomFruitPosition = (snakePositions) => {
  let position = generateRandomPosition();
  let isEmptyPosition = false;

  while (!isEmptyPosition) {
    isEmptyPosition = snakePositions.every(
      ({ x, y }) => x !== position.x && y !== position.y
    );
    if (!isEmptyPosition) {
      position = generateRandomPosition();
    }
  }

  return position;
};
