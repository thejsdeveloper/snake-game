# ![N|Solid](https://github.com/thejsdeveloper/snake-game/blob/main/public/favicon.png) Snake Game - React Implematation

### Live app

You can play the game [here](https://thejsdeveloepr-snake-game.vercel.app/)

![game](https://github.com/thejsdeveloper/snake-game/blob/main/public/inprogress.gif)

### How to play

To move you can use following keys

- `up` : up arrow key or `w`
- `down`: down arrow key or `s`
- `left` : left arrow key or `d`
- `right`: right arrow key or `a`

### Requirements

- 15x15 grid
- Snake should be controlled with cursor keys (or WASD if you prefer)
- Snake should start with a length of 3
- One apple at a time should appear in a random position on the grid. When collected, it should increase the score by one, increase the snake length by one, and change to another random position
- Display a score for how many apples have been collected
- If the snake head collides with the rest of the body, the game should end
- If the snake head collides with the borders, the game should end

## My Solution

### Tech Stack

`React`

### Game state and logic

All the game logic is encapsulated in [useSnakeGame](https://github.com/thejsdeveloper/snake-game/blob/main/src/reducers/gameReducer.js) hook.

I utilize the power of `useReducer` hook to manage the state of the game.

#### Action

There can be two type of `action` for user

- **Start Game**
- **Move** i.e. move the snake with controls `a`, `s`, `d`, `w` or with `arrow` keys

#### State

There are three possible `state` for the game

- `idle` : Initial state of game
  ![idle](https://github.com/thejsdeveloper/snake-game/blob/main/public/start.png)
- `inprogress`: When game is in progress
  
  ![inprogress](https://github.com/thejsdeveloper/snake-game/blob/main/public/inprogress.gif)
- `end`: When game has ended
  ![end state](https://github.com/thejsdeveloper/snake-game/blob/main/public/end.png)

#### Start Game

when user presses `space` we start game by dispatching `starGame` event

```js
dispatch({
  type: "startGame",
});
```

I capture the space event via `useSpaceKeydown` hook.

There is no `restart` action as I utilize the same action for restarting the game as well. I only dispatch this event if game is not `inprogress` state i.e. either `idle` or `end` state. If space is pressed during a ongoing game, it will be ignored.

```js
useSpaceKeydown(() => {
  if (state.status === "inprogress") {
    return;
  }
  dispatch({
    type: "startGame",
  });
});
```

#### Move

When user press control keys there can be two types move

##### IIlegal Move

- If snake is moving in `right` direction and user presses `a` or `< left arrow key` key
- If snake is moving in `left` direction and user presses `d` or `> right arrow key` key
- If snake is moving in `up` direction and user presses `s` or `v down arrow key` key
- If snake is moving in `down` direction and user presses `w` or `^ up arrow key` key

If any move is illegal then we just return current state of the game to ignore that move. We check this with `isValidDirection` defined in [gameUtils](https://github.com/thejsdeveloper/snake-game/blob/main/src/utils/gameUtils.js)

```js
const isAllowedDirection = isValidDirection(currentDirection, state.direction);
```

##### Legal Move

All the moves which are not illegal is valid moves. For all such move following can happen

**Snake can move to a empty space**
If snake move to empty space we keep the score same and generate the new state of the game and return

**Snake can eat the fruit**
If snake has eaten the fruit then we can increase the score and increase the snake length and calculate the new state and return

**Snake can collide with wall**
If this happens then the game should end. We can end the game and return the state.

**Snake can collide with itself**
If the snake is collided with itself that also a game end scenario. We can end the game and return the state.

## Components

All the components are in [scr/components](https://github.com/thejsdeveloper/snake-game/tree/main/src/components) folder

There are two components

- Grid
- Grid cell

### Grid

#### Responsibilities

- Render grid
- Render snake and fruit
- Show score and highest score
- Show information to start the game
- Show Information at the end of the game

#### Props

```js
const GridProps = {
  grid,
  status,
  score,
};
```

- grid: Which is a `2d` array of `rows` and `col`
- status: Game status
- score: Score of current game

### GridCell

#### Responsibilities

It is the lower level component of game. It maps to each cell in the grid. Depending upon the position of snake and cell. Grid can be in three state

#### Props

```js
const GridCellProps = { content };
```

**content**
Content can be one of the followings

- Empty
- Snake
- Snake head - Just to show different color for head
- Fruit

I set the background color of the grid based on these three contents via `css variables`

```js
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
```

## Hooks

All the hooks are in [src/hooks](https://github.com/thejsdeveloper/snake-game/tree/main/src/hooks) folder.

There are following hooks

[useEventListener](https://github.com/thejsdeveloper/snake-game/blob/main/src/hooks/useEventListener.js)
This is a lower level hook to capture any kind of `event`

```js
import { useEffect, useRef } from "react";

export const useEventListener = (
  eventName,
  handler,
  element = window,
  options = {
    once: false,
  }
) => {
  const savedEventHandler = useRef();
  const { once } = options;

  useEffect(() => {
    savedEventHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event) => savedEventHandler.current(event);

    const opt = { once };
    element.addEventListener(eventName, listener, opt);

    return () => {
      element.removeEventListener(eventName, listener);
    };
  }, [eventName, element, once]);
};
```

[useIntervalHook](https://github.com/thejsdeveloper/snake-game/blob/main/src/hooks/useInterval.js)
This is used for moving the snake at specified interval.

```js
import { useEffect, useRef } from "react";

export const useInterval = (cb, interval) => {
  const savedCallback = useRef(cb);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    savedCallback.current = cb;
  }, [cb]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof interval === "number") {
      intervalIdRef.current = setInterval(tick, interval);
      return () => window.clearInterval(intervalIdRef.current);
    }
  }, [interval]);

  return intervalIdRef;
};
```

[useSpaceKeyDown](https://github.com/thejsdeveloper/snake-game/blob/main/src/hooks/useSpaceKeydown.js)
This is a hook which uses `useEventListener` to capture `space` event so that we can `start` and `restart` the game.

```js
import { useCallback } from "react";
import { useEventListener } from "./useEventListener";

export const useSpaceKeydown = (cb) => {
  const handleSpaceKey = useCallback(
    (e) => {
      e.preventDefault();
      if (e.code.toLowerCase() !== "space") {
        return;
      }
      cb();
    },
    [cb]
  );

  return useEventListener("keydown", handleSpaceKey);
};
```

[useDirectionControl]()
This is the hook which again uses `useEventListener` to capture the control key presses.

```js
import React, { useEffect } from "react";
import { useEventListener } from "./useEventListener";

export const useGameDirectionControl = (init) => {
  const directionRef = React.useRef(init);

  useEffect(() => {
    directionRef.current = init;
  }, [init]);

  const handleKeyEvents = React.useCallback((e) => {
    e.preventDefault();
    switch (e.code) {
      case "ArrowUp":
      case "KeyW": {
        directionRef.current = "up";
        break;
      }
      case "ArrowDown":
      case "KeyS": {
        directionRef.current = "down";
        break;
      }
      case "ArrowRight":
      case "KeyD": {
        directionRef.current = "right";
        break;
      }
      case "ArrowLeft":
      case "KeyA": {
        directionRef.current = "left";
        break;
      }
    }
  }, []);

  useEventListener("keydown", handleKeyEvents);

  return directionRef;
};
```

[useLocalStorage]()
This is used for setting and reading the values from local storage. This is used for `highest score`

```js
import React from "react";

export const useLocalStorage = (key, defaultValue) => {
  const [storedValued, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValued));
  }, [key, storedValued]);

  return [storedValued, setStoredValue];
};
```

## Readings

- [Interval hook by Josh Comeau](https://www.joshwcomeau.com/snippets/react-hooks/use-interval/)
- [Event Listener hook by Donavon](https://github.com/donavon/use-event-listener/tree/develop)
- [Snake game exercise](https://frontendeval.com/questions/snake)
