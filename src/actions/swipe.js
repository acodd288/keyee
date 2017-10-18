import {
  removeText,
  moveCursor,
  addText
} from './buffer'
import {setCapslock, setNumberSymbols} from './keyboard'
import {findClosestLetter} from '../reducers/swipe/curvature'

export const SET_WORD_PRIORS = 'SET_WORD_PRIORS'

export function setWordPriors(wordPriors) {
  return {
    type: SET_WORD_PRIORS,
    wordPriors
  }
}

export const SWIPE_TOUCH = 'SWIPE_TOUCH'

export function swipeTouch(x,y) {
  return {
    type: SWIPE_TOUCH,
    x,
    y
  }
}

function mapKeyToAction(key, state) {
  let {cursorPosition, content} = state.buffer.current;
  let {capsLock, numberSymbols} = state.keyboard;
  if (key === 'BACKSPACE') {
    return removeText({start:cursorPosition-1, end:cursorPosition});
  }
  else if (key === 'MOVE_LEFT') {
    return moveCursor(Math.max(0, cursorPosition-1));
  }
  else if (key === 'MOVE_RIGHT') {
    return moveCursor(Math.min(content.length, cursorPosition+1));
  }
  else if (key === 'CAPSLOCK') {
    return setCapslock(!capsLock);
  }
  else if (key === 'NUMBER_SYMBOLS') {
    return setNumberSymbols(!numberSymbols);
  }
  else {
    if (!capsLock) {
      key = key.toLowerCase();
    }
    return addText(key);
  }
}

export const SWIPE_CLICK = 'SWIPE_CLICK'

export function swipeClick(point) {
  return (dispatch, getState) => {
    let state = getState();
    let key = findClosestLetter(point, state.swipe.keyboardLayout.keys);
    let action = mapKeyToAction(key, state);
    dispatch(action);
  }
}

export const SWIPE_KEYBOARD_LAYOUT = 'SWIPE_KEYBOARD_LAYOUT'

export function setSwipeKeyboardLayout(layout) {
  return {
    type: SWIPE_KEYBOARD_LAYOUT,
    layout
  }
}
