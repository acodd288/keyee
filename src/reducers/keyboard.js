import { combineReducers } from 'redux'
import {
  SET_CAPSLOCK,
  SET_NUMBER_SYMBOLS
} from '../actions/keyboard'

function capsLock(state = false, action) {
  switch (action.type) {
    case SET_CAPSLOCK:
      return action.state;
    default:
      return state;
  }
}

function numberSymbols(state = false, action) {
  switch (action.type) {
    case SET_NUMBER_SYMBOLS:
      return action.state;
    default:
      return state;
  }
}

const keyboard = combineReducers({
  capsLock,
  numberSymbols
})

export default keyboard
