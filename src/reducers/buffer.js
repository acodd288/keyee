import { combineReducers } from 'redux'
import {
  INVALIDATE_FILE,
  REQUEST_FILE,
  RECEIVE_FILE,
  ADD_TEXT,
  REMOVE_TEXT,
  MOVE_CURSOR
} from '../actions/buffer'

function current(
  state = {
    fileName: null,
    isFetching: false,
    isValid: false,
    lastUpdated: null,
    content: null,
    cursorPosition: 0
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_FILE:
      return Object.assign({}, state, {
        isValid: false
      })
    case REQUEST_FILE:
      return Object.assign({}, state, {
        fileName: action.file,
        isFetching: true,
        isValid: false
      })
    case RECEIVE_FILE:
      return Object.assign({}, state, {
        fileName: action.file,
        isFetching: false,
        isValid: true,
        content: action.content,
        lastUpdated: action.receivedAt,
        cursorPosition:0
      })
    case ADD_TEXT:
      if (state.isValid) {
        let {content} = state;
        content = content.substring(0, state.cursorPosition) +
          action.text +
          content.substring(state.cursorPosition);
        let cursorPosition = state.cursorPosition + action.text.length;
        return {...state, content, cursorPosition}
      }
      else {
        return state;
      }
    case REMOVE_TEXT:
      let {content} = state;
      let {start, end} = action.range;
      let cursorPosition = Math.max(start, 0);
      content = content.substring(0, start) + content.substring(end);
      return {...state, content, cursorPosition};
    case MOVE_CURSOR:
      return {...state, cursorPosition: action.position}
    default:
      return state
  }
}

const buffer = combineReducers({
  current
})

export default buffer
