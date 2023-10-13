import React from "react";
import {
  generateGrid,
  generateGridWithSnakeAndApple,
  generateRandomFruitPosition,
  getNextPostion,
  hasEatenFruit,
  isCollidedWithItself,
  isMoveWithinBounds,
} from "../utils/gameUtils";
import { useGameControl } from "../hooks/useGameControl";
import {
  COLUNMS,
  ROWS,
  getSpeed,
  isValidDirection,
} from "../constants/gameConstants";

const INITIAL_STATE = {
  grid: generateGrid(),
  snake: [{ x: ROWS / 2, y: COLUNMS / 2 }],
  fruit: [{ x: ROWS / 2 + 1, y: COLUNMS / 2 + 1 }],
  status: "idle",
  score: 0,
  highestScore: Number(localStorage.getItem("snake-highScore")) || 0,
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
       * if previous direction (diretion in state) is
       * right -> ignore lefy
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
       * then calculate next postion
       */

      const currentPos = state.snake[0];
      const nextPos = getNextPostion(currentPos, currentDirection);
      /**
       * check if the move is winthin bounds of grid
       * if not then it mean snake colided with wall
       * and game should end
       */
      const moveWithinBounds = isMoveWithinBounds(nextPos.x, nextPos.y);

      /**
       * check if the move made snake to collide itself
       * if yes it mean snake colided with wall
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

      const nextScore = eatenFruit ? state.score++ : state.score;
      let nextHighestScore = state.highestScore;

      if (nextScore > state.highestScore) {
        nextHighestScore = nextScore;
        localStorage.setItem("snake-highScore", nextHighestScore);
      }
      const nextFruit = eatenFruit
        ? generateRandomFruitPosition(state.snake)
        : state.fruit;

      /**
       * since snake has made a move we need to calculate new grid
       * instead of iterating through grid and finding out where is snake
       * I think it is better to generate the grid and position the snake and apple at
       * correct postion
       */
      const nextGrid = generateGridWithSnakeAndApple(snakeClone, nextFruit);

      const nextState = {
        ...state,
        grid: nextGrid,
        snake: snakeClone,
        fruit: nextFruit,
        direction: currentDirection,
        score: nextScore,
        highestScore: nextHighestScore,
      };

      return nextState;
    }
    case "startGame": {
      /***
       * id game is inprogress ignore all the events to start the game
       * i.e. if user pressess space key during game just ignore it
       */
      if (state.status === "inprogress") {
        return state;
      }
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
        highestScore: Number(localStorage.getItem("snake-highScore")) || 0,
      };
    }
    default:
      return state;
  }
}

export const useSnakeGame = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const directionRef = useGameControl(state.direction);
  const intervalIdRef = React.useRef(null);

  const { status } = state;

  React.useEffect(() => {
    const handleSpaceKey = (e) => {
      e.preventDefault();
      if (e.code.toLowerCase() !== "space") {
        return;
      }
      dispatch({
        type: "startGame",
      });
    };

    window.addEventListener("keydown", handleSpaceKey);
    () => {
      window.removeEventListener("keydown", handleSpaceKey);
    };
  }, []);

  React.useEffect(() => {
    if (status === "end") {
      directionRef.current = "right";
      clearInterval(intervalIdRef.current);
    }

    if (status === "inprogress") {
      const speed = getSpeed();
      intervalIdRef.current = setInterval(() => {
        dispatch({
          type: "move",
          direction: directionRef.current,
        });
      }, speed);
    }

    () => {
      clearInterval(intervalIdRef.current);
    };
  }, [status, directionRef]);

  return {
    state,
  };
};
