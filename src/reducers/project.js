import { combineReducers } from 'redux'
import {
  INVALIDATE_PROJECT,
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
} from '../actions/project'

function project(
  state = {
    name: null,
    isFetching: false,
    isValid: false,
    lastUpdated: null,
    files: null,
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_PROJECT:
      return Object.assign({}, state, {
        isValid: false
      })
    case REQUEST_PROJECT:
      return Object.assign({}, state, {
        name: action.name,
        isFetching: true,
        isValid: false
      })
    case RECEIVE_PROJECT:
      return Object.assign({}, state, {
        name: action.name,
        isFetching: false,
        isValid: true,
        files: action.files,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

export default project;
