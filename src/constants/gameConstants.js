const BOARD_SIZE = 12;
export const ROWS = BOARD_SIZE;
export const COLUMNS = BOARD_SIZE;
export const DIRECTION_DELTAS = {
  left: [0, -1],
  right: [0, 1],
  up: [-1, 0],
  down: [1, 0],
};

const SPEED = {
  easy: 300,
  medium: 200,
  difficult: 100,
};

export const getSpeed = (difficultyLevel = "easy") => {
  return SPEED[difficultyLevel];
};

const DISALLOWED_DIRECTIONS = {
  right: "left",
  left: "right",
  up: "down",
  down: "up",
};

export const isValidDirection = (currentDirection, previousDirection) =>
  DISALLOWED_DIRECTIONS[previousDirection] !== currentDirection;

export const SNAKE_HIGHEST_SCORE_KEY = "snake-highest-score";
