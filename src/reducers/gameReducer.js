import React from "react";
import {
  generateGrid,
  generateGridWithSnakeAndApple,
  generateRandomFruitPosition,
  getNextPosition,
  hasEatenFruit,
  isCollidedWithItself,
  isMoveWithinBounds,
} from "../utils/gameUtils";
import { useGameDirectionControl } from "../hooks/useGameDirectionControl";
import {
  COLUMNS,
  ROWS,
  getSpeed,
  isValidDirection,
} from "../constants/gameConstants";
import { useInterval } from "../hooks/useInterval";
import { useSpaceKeydown } from "../hooks/useSpaceKeydown";

const speed = getSpeed();

const INITIAL_STATE = {
  grid: generateGrid(),
  snake: [{ x: ROWS / 2, y: COLUMNS / 2 }],
  fruit: [{ x: ROWS / 2 + 1, y: COLUMNS / 2 + 1 }],
  status: "idle",
  score: 0,
  direction: "right",
};

function reducer(state, action) {
  switch (action.type) {
    case "move": {
      let currentDirection = action.direction;
      /**
       * before making move check if the direction is allowed
       * like if the snake is moving right and user presses left key then
       * we can keep on moving to right
       * if previous direction (direction in state) is
       * right -> ignore left
       * left -> ignore right
       * up => ignore down
       * down -> ignore up
       */
      const isAllowedDirection = isValidDirection(
        currentDirection,
        state.direction
      );

      if (!isAllowedDirection) {
        currentDirection = state.direction;
      }

      /**
       * if it is valid direction move
       * then calculate next position
       */

      const currentPos = state.snake[0];
      const nextPos = getNextPosition(currentPos, currentDirection);
      /**
       * check if the move is within bounds of grid
       * if not then it mean snake collided with wall
       * and game should end
       */
      const moveWithinBounds = isMoveWithinBounds(nextPos.x, nextPos.y);

      /**
       * check if the move made snake to collide itself
       * if yes it mean snake collided with wall
       * and game should end
       */
      const collidedWithItself = isCollidedWithItself(nextPos, state.snake);

      if (!moveWithinBounds || collidedWithItself) {
        return {
          ...state,
          status: "end",
        };
      }

      /**
       * if it is valid move and within bounds and snake is not collided with itself
       * check if snake has eaten fruits
       * if yes then increase length i.e. do not pop tail and add head
       * else to show movement add head but pop the tail
       */

      const snakeClone = [nextPos, ...state.snake];
      const eatenFruit = hasEatenFruit(nextPos, state.fruit);
      if (!eatenFruit) {
        snakeClone.pop();
      }

      let nextScore = state.score;
      if (eatenFruit) {
        nextScore += 1;
      }

      const nextFruit = eatenFruit
        ? generateRandomFruitPosition(state.snake)
        : state.fruit;

      /**
       * since snake has made a move we need to calculate new grid
       * instead of iterating through grid and finding out where is snake
       * I think it is better to generate the grid and position the snake and apple at
       * correct position
       */
      const nextGrid = generateGridWithSnakeAndApple(snakeClone, nextFruit);

      const nextState = {
        ...state,
        grid: nextGrid,
        snake: snakeClone,
        fruit: nextFruit,
        direction: currentDirection,
        score: nextScore,
      };

      return nextState;
    }
    case "startGame": {
      const fruitPosition = generateRandomFruitPosition(state.snake);

      const nextGrid = generateGridWithSnakeAndApple(
        state.snake,
        fruitPosition
      );

      return {
        ...INITIAL_STATE,
        grid: nextGrid,
        fruit: fruitPosition,
        status: "inprogress",
      };
    }
    default:
      return state;
  }
}

export const useSnakeGame = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const { status } = state;
  useSpaceKeydown(() => {
    /***
     * if game is inprogress ignore all the events to start the game
     * i.e. if user presses space key during game just ignore it
     */
    if (state.status === "inprogress") {
      return;
    }
    dispatch({
      type: "startGame",
    });
  });

  const directionRef = useGameDirectionControl(state.direction);

  useInterval(
    () => {
      if (status === "inprogress") {
        dispatch({
          type: "move",
          direction: directionRef.current,
        });
      }
    },
    status === "end" ? null : speed
  );

  return {
    state,
  };
};
