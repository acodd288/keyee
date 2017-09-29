import { combineReducers } from 'redux'
import {
  SET_CAPSLOCK
} from '../actions/keyboard'

function capsLock(state = false, action) {
  switch (action.type) {
    case SET_CAPSLOCK:
      return action.state;
    default:
      return state;
  }
}
const keyboard = combineReducers({
  capsLock
})

export default keyboard
